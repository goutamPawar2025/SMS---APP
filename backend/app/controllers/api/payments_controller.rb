class Api::PaymentsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create_order

    amount = params[:amount].to_i
    amount_paise = amount * 100


    if amount <= 0
      render json: { error: 'Invalid amount' }, status: :unprocessable_entity and return
    end

    order = Razorpay::Order.create(
      amount: amount_paise,
      currency: 'INR',
      receipt: "receipt_#{SecureRandom.hex(5)}",
      payment_capture: 1
    )

    render json: {
      order_id: order.id,
      razorpay_key: Rails.application.credentials.dig(:razorpay, :key_id),
      amount: order.amount,
      currency: order.currency
    }, status: :ok

  rescue => e
    Rails.logger.error e.backtrace.join("\n")
    render json: { error: 'Failed to create order', details: e.message }, status: :unprocessable_entity
  end

  def verify_payment
  order_id   = params[:order_id]
  payment_id = params[:payment_id]
  signature  = params[:signature]
  user_id    = params[:user_id]
  plan_name  = params[:plan_name]

  generated_signature = OpenSSL::HMAC.hexdigest(
    'SHA256',
    Rails.application.credentials.dig(:razorpay, :key_secret),
    "#{order_id}|#{payment_id}"
  )

  if generated_signature == signature
    credits = case plan_name
              when 'basic' then 5
              when 'standard' then 50
              when 'premium' then 100
              else 0
              end

    subscription = Subscription.find_by(
      user_id: user_id,
      plan_name: plan_name,
    )
    if subscription
       subscription.credits += credits

       subscription.end_date = 1.month.from_now

       subscription.payment_id = payment_id

      subscription.save!
    else

      Subscription.create!(
        user_id: user_id,
        status: 1,
        end_date: 1.month.from_now,
        plan_name: plan_name,
        payment_id: payment_id,
        credits: credits
      )
    end

    render json: {
      status: 'success',
      message: "Payment verified. #{credits} credits added"
    }, status: :ok
  else
    render json: {
      status: 'failed',
      message: 'Payment verification failed'
    }, status: :unauthorized
  end

rescue => e
   Rails.logger.error e.backtrace.join("\n")
  render json: { error: 'Something went wrong', details: e.message }, status: :internal_server_error
end
end
