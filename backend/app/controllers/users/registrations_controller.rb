class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  def new
   end

  def create
    build_resource(sign_up_params)
    resource.save
    if resource.persisted?
      render json: {
        status: { code: 200, message: 'Signed up successfully' },
        data: resource.as_json(only: [:id, :email, :created_at, :updated_at])
      }, status: :ok
    else
      render json: {
        status: { code: 422, message: "Sign up failed", errors: resource.errors.full_messages }
      }, status: :unprocessable_entity
    end
  end

  private

  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end
end
