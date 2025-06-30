
  class  Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
    def google_oauth2
      auth = request.env['omniauth.auth']
     puts "inside here"
      @user = User.find_or_create_by(email: auth.info.email) do |user|
        user.name = auth.info.name
        user.password = Devise.friendly_token[0, 20]
      end

      if @user.persisted?
        sign_in_and_redirect @user, event: :authentication
      else
        redirect_to new_user_registration_url, alert: 'Google sign-in failed'
      end
    end
  end
