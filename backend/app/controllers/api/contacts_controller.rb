class Api::ContactsController < ApplicationController
  before_action :authenticate_user!

  def index
    user_id = params[:user_id] || current_user.id
    @contacts = Contact.where(user_id: user_id)
    render json: @contacts
  end

  def create
    emails = params[:emails]
    user_id = params[:user_id] || current_user.id

    if emails.blank? || !emails.is_a?(Array)
      render json: { error: 'Invalid emails array' }, status: :unprocessable_entity and return
    end

    created_contacts = []
    errors = []

    emails.each do |email|
      contact = Contact.find_or_initialize_by(email: email, user_id: user_id)
      if contact.new_record?
        if contact.save
          created_contacts << contact
        else
          errors << { email: email, errors: contact.errors.full_messages }
        end
      else
        created_contacts << contact
      end
    end

    render json: {
      created: created_contacts,
      errors: errors
    }, status: errors.any? ? :unprocessable_entity : :created
  end

  def show
    @contact = Contact.find_by(id: params[:id])
    if @contact
      render json: @contact
    else
      render json: { error: "Contact not found" }, status: :not_found
    end
  end

  def update
    @contact = Contact.find_by(id: params[:id])
    if @contact&.update(contact_params)
      render json: @contact
    else
      render json: { errors: @contact ? @contact.errors.full_messages : ["Contact not found"] }, status: :unprocessable_entity
    end
  end

  def destroy
    @contact = Contact.find_by(id: params[:id])
    if @contact&.destroy
      render json: { message: "Contact deleted successfully" }
    else
      render json: { error: "Contact not found or failed to delete" }, status: :unprocessable_entity
    end
  end

  def import_csv
    if params[:file].present?
      file = params[:file]
      valid_phones = []
      invalid_phones = []

      SmarterCSV.process(file.path) do |chunk|
        chunk.each do |row|
          phone = row[:phone_number] || row[:phone] || row[:mobile]
          next unless phone.present?

          parsed = Phonelib.parse(phone, 'IN')

          if parsed.valid? && parsed.country == 'IN' && parsed.type == :mobile
            valid_phones << parsed.e164 
          else
            invalid_phones << phone
          end
        end
      end

      # Optionally save valid phones here too!

      render json: {
        phone_numbers: valid_phones.uniq,
        invalid_numbers: invalid_phones.uniq
      }, status: :ok
    else
      render json: { error: 'No file uploaded' }, status: :unprocessable_entity
    end
  end

  private

  def contact_params
    params.permit(:user_id, emails: [])
  end
end
