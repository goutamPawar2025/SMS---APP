class ApplicationController < ActionController::API

  attr_reader :current_user

  private

  def authenticate_user!
    header = request.headers['Authorization']
    token = header.split(' ').last if header
    if token.present?
      begin
        decoded = JWT.decode(token, Rails.application.credentials.secret_key_base)[0]
        @current_user = User.find(decoded['user_id'])
      rescue JWT::DecodeError, JWT::ExpiredSignature
        render json: { error: 'Unauthorized or expired token' }, status: :unauthorized
      end
    else
      render json: { error: 'Missing token' }, status: :unauthorized
    end
  end
end
