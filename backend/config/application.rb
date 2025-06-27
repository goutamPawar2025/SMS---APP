
require_relative "boot"
require "rails/all"
require "omniauth"

Bundler.require(*Rails.groups)

module SmsApplication
  class Application < Rails::Application
    config.load_defaults 8.0

     config.eager_load_paths << Rails.root.join("app", "controllers", "user")

     config.api_only = false

     config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Session::CookieStore

    # Optional mailer settings
    config.action_mailer.perform_deliveries = true
    config.action_mailer.raise_delivery_errors = true
  end
end
