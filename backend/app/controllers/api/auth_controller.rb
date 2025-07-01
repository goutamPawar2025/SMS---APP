 class Api::AuthController < ApplicationController
   before_action :authenticate_user!

  def validate_token
    render json: { status: 'valid', user_id: @current_user.id }, status: :ok
  end
end
