class Api::ContactsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    @contacts = Contact.all
    render json: @contacts
  end

  def create
    @contact = Contact.new(contact_params)
    if @contact.save
      render json: @contact, status: :created
    else
      render json: { errors: @contact.errors.full_messages }, status: :unprocessable_entity
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
      :name,
      :phone_number,
      :age,
      :gender,
      :is_blocked,
      :user_id,
      :collection_id
    )
  end
end
