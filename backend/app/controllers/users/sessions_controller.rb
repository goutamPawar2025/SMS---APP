class Users::SessionsController < Devise::SessionsController
before_action :authenticate_user!, except: [:create]

   respond_to :json
def create
  user = User.find_by(email: sign_in_params[:email])
  if user.nil?
    render json: {
      status: 404,
      message: 'Email not registered'
    }, status: :not_found

  elsif user.valid_password?(sign_in_params[:password])
    sign_in(user)

    payload = { user_id: user.id, exp: 24.hours.from_now.to_i }
    token = JWT.encode(payload, Rails.application.credentials.secret_key_base)

    render json: {
      status: { code: 200, message: 'Logged in successfully' },
      data: user.slice(:id, :email, :created_at, :updated_at),
      token: token
    }, status: :ok

  else
    render json: {
      status: 401,
      message: 'Invalid password'
    }, status: :unauthorized
  end
end


  def respond_to_on_destroy
    token = request.headers['Authorization']&.split(' ')&.last

    if token.present?
      begin
        JWT.decode(token, Rails.application.credentials.secret_key_base)
        render json: { status: 200, message: 'Logged out successfully.' }, status: :ok
      rescue JWT::DecodeError, JWT::ExpiredSignature
        render json: { status: 401, message: 'Token invalid or expired.' }, status: :unauthorized
      end
    else
      render json: { status: 401, message: 'Authorization header missing.' }, status: :unauthorized
    end
  end

  private

  def sign_in_params
    params.require(:user).permit(:email, :password)
  end
end
