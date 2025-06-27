class Api::SubscriptionsController < ApplicationController
  before_action :set_subscription, only: [:update]

   def index
    subscriptions = Subscription.all
    render json: subscriptions
  end

   def create
    subscription = Subscription.new(subscription_params)

    if subscription.save
      render json: { message: "Subscription created successfully", subscription: subscription }, status: :created
    else
      render json: { errors: subscription.errors.full_messages }, status: :unprocessable_entity
    end
  end

   def update
    if @subscription.update(subscription_params)
      render json: { message: "Subscription updated", subscription: @subscription }
    else
      render json: { errors: @subscription.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_subscription
    @subscription = Subscription.find_by(id: params[:id])
    unless @subscription
      render json: { error: "Subscription not found" }, status: :not_found
    end
  end

  def subscription_params
    params.require(:subscription).permit(:user_id, :status, :end_date)
  end
end
