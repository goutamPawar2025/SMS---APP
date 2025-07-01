Rails.application.routes.draw do
  get "subscription/index"
  get "subscription/create"
  get "subscription/update"
  devise_for :users,
             defaults: { format: :json },
             controllers: {
               sessions: 'users/sessions',
               registrations: 'users/registrations',
               omniauth_callbacks: 'users/omniauth_callbacks'
             }

  devise_scope :user do
    # Google OAuth2 callback
    get '/auth/:provider/callback', to: 'users/omniauth_callbacks#google_oauth2'

    # Custom Devise routes
    post '/signup', to: 'user/registrations#create'
    post '/login', to: 'user/sessions#create'
    delete '/logout', to: 'user/sessions#destroy'
    post '/emails/upload', to: 'emails#upload'

  end


  namespace :api do
    post 'payments/create_order', to: 'payments#create_order'
    post 'payments/verify_payment', to: 'payments#verify_payment'
    post 'contacts/import_csv', to: 'contacts#import_csv'
    get 'dashboard/email_count', to: 'dashboard#email_count'
    resources :subscriptions, only: [:index, :create, :show, :update, :destroy]
    resources :contacts, only: [:index, :create, :show, :update, :destroy]
    resources :campaigns, only: [:index, :create, :show, :update, :destroy]
    resources :collections, only: [:index, :create, :show, :update, :destroy]
    resources :complaints, only: [:index, :create, :show, :update, :destroy]
    resources :message_templates, only: [:index, :create, :show, :update, :destroy]
  end
end
