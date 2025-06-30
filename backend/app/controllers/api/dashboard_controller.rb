# app/controllers/api/v1/dashboard_controller.rb
class Api::DashboardController < ApplicationController
  before_action :authenticate_user! # Devise/JWT ke hisaab se

  def email_count
    sent_count = current_user.emails.where(status: 'sent').count
    failed_count = current_user.emails.where(status: 'failed').count
    total = current_user.emails.count

    render json: {
      total_sent: sent_count,
      failed: failed_count,
      total: total
    }
  end
end
