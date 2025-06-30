require 'csv'

class EmailsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def upload
    file = params[:file]
    message = params[:message]

    addresses = if file.present?
                  extract_gmails(file)
                elsif params[:emails].present?
                  params[:emails]
                else
                  return render json: { error: 'Email is required — please upload a file or provide emails.' }, status: :unprocessable_entity
                end
      count = addresses.count
    addresses.each do |email|
      BulkMailer.send_bulk_email(email, message).deliver_later
    end

    render json: { success: true, emails: addresses }
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
