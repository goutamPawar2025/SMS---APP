class Api::PaymentsController < ApplicationController
  skip_before_action :verify_authenticity_token

   def create_order
    amount = params[:amount].to_i * 100
    order = ::Razorpay::Order.create(
      amount: amount,
      currency: 'INR',
      receipt: "receipt_#{SecureRandom.hex(5)}",
      payment_capture: 1
    )

    render json: {
      order_id: order.id,
      razorpay_key: ENV['RAZORPAY_KEY_ID'] || 'rzp_test_zgjSSDynhauyTo',
      amount: order.amount,
      currency: order.currency
    }
  rescue => e
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

  Subscription.create!(
    user_id: user_id,
    status: 1,
    end_date: 1.month.from_now,
    plan_name: plan_name,
    payment_id: payment_id,
    credits: credits
  )
  binding.pry

  render json: {
    status: 'success',
    message: "Payment verified. #{credits} credits added to subscription!"
  }, status: :ok
else
  render json: {
    status: 'failed',
    message: 'Payment verification failed'
  }, status: :unauthorized
end
rescue => e
  Rails.logger.error "Verify payment failed: #{e.message}"
  Rails.logger.error e.backtrace.join("\n")
  render json: { error: 'Something went wrong', details: e.message }, status: :internal_server_error
end

end
