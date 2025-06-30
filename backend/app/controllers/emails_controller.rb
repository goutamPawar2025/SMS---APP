require 'csv'

class EmailsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def upload
    file = params[:file]
    message = params[:message]
    user_id = params[:user_id]

     addresses = if file.present?
                  extract_gmails(file)
                elsif params[:emails].present?
                  params[:emails]
                else
                  return render json: { error: 'Email is required — upload a file or provide emails.' }, status: :unprocessable_entity
                end

    count = addresses.count

     if file.present?
      return render json: { success: true, emails: addresses }
    end

     subscription = Subscription.where(user_id: user_id).order(created_at: :desc).first

    unless subscription
      return render json: { error: 'No active subscription found' }, status: :unprocessable_entity
    end

    if subscription.credits < count
      return render json: { error: 'Insufficient credits' }, status: :unprocessable_entity
    end

     addresses.each do |email|
      BulkMailer.send_bulk_email(email, message).deliver_later
    end

     subscription.credits -= count
    subscription.save!

    render json: {
      success: true,
      emails: addresses,
      updated_credits: Subscription.where(user_id: user_id).sum(:credits) # total
    }
  end

  private

  def extract_gmails(file)
    gmails = []
    SmarterCSV.process(file.tempfile.path, col_sep: "\t") do |row_array|
      row_hash = row_array.first
      row_hash.each_value do |value|
        emails = value.to_s.scan(/\b[A-Za-z0-9._%+-]+@gmail\.com\b/)
        gmails.concat(emails)
      end
    end
    gmails.uniq
  end
end
