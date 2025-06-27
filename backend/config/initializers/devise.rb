Devise.setup do |config|
  # 👇 Google OAuth setup (Already correct)
  config.omniauth :google_oauth2,
    '1090714994013-66gmf9tl110oluopeljlan12gog6u082.apps.googleusercontent.com',
    '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',
    {
      scope: 'email,profile',
      prompt: 'select_account',
      access_type: 'offline'
    }

  config.jwt do |jwt|
    jwt.secret = Rails.application.credentials.secret_key_base
    jwt.dispatch_requests = [
      ['POST', %r{^/login$}],
      ['GET', %r{^/users/auth/google_oauth2/callback$}] 
    ]
    jwt.revocation_requests = [
      ['DELETE', %r{^/logout$}]
    ]
    jwt.expiration_time = 30.minutes.to_i
  end

  config.navigational_formats = ['*/*', :html, :json] 

  config.mailer_sender = 'please-change-me-at-config-initializers-devise@example.com'
  require 'devise/orm/active_record'
  config.case_insensitive_keys = [:email]
  config.strip_whitespace_keys = [:email]
  config.skip_session_storage = [:http_auth, :params_auth]
  config.stretches = Rails.env.test? ? 1 : 12
  config.reconfirmable = true
  config.expire_all_remember_me_on_sign_out = true
  config.password_length = 6..128
  config.email_regexp = /\A[^@\s]+@[^@\s]+\z/
  config.reset_password_within = 6.hours
  config.sign_out_via = :delete
  config.responder.error_status = :unprocessable_entity
  config.responder.redirect_status = :see_other
  config.navigational_formats = []
  

end
