class Api::ContactsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    @contacts = Contact.all
    render json: @contacts
   end

def create
  emails = params[:emails]
  user_id = params[:user_id]

  if emails.blank? || !emails.is_a?(Array)
    render json: { error: 'Invalid emails array' }, status: :unprocessable_entity and return
  end

  created_contacts = []
  errors = []

  emails.each do |email|
    contact = Contact.new(email: email, user_id: user_id)
    if contact.save
      created_contacts << contact
    else
      errors << { email: email, errors: contact.errors.full_messages }
    end
  end

  if errors.any?
    render json: { created: created_contacts, errors: errors }, status: :unprocessable_entity
  else
    render json: created_contacts, status: :created
  end
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
    params.require(:contact).permit(
      :emails,
      :user_id,
    )
  end
end
