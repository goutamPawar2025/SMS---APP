class UsersController < ApplicationController

  def index
    users = User.all
    render json: users
  end

  def create
    user = User.new(user_params)
    if user.save
      render json: user, status: :created
    else
      render json: user.errors, status: :unprocessable_entity
    end
  end

   def update
    user = User.find(params[:id])
     if user.update(user_params)
        render json: user, status: :ok
      else
       render json: user.errors, status: :unprocessable_entity
  end

end

  private

  def user_params
    params.require(:user).permit(
      :full_name,
      :email,
      :phone_number,
      :password_hash,
      :verified,
      :gov_doc_path,
      :gov_doc_status,
      :preferred_channel
    )
  end
end
