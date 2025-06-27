class BulkMailer < ApplicationMailer

  def send_bulk_email(email, message)
    @message = message
    mail(to: email, subject: "Bulk Message") do |format|
      format.text { render plain: @message }
    end
  end
end
