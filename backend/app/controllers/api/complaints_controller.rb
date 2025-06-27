module Api
  class ComplaintsController < ApplicationController

    def index
      if params[:user_id]
        @complaints = Complaint.where(user_id: params[:user_id])
        render json: @complaints
      else
        render json: { error: "user_id not provided" }, status: :bad_request
      end
    end


     def show
      @complaint = Complaint.find_by(id: params[:id])

      if @complaint
        render json: @complaint
      else
        render json: { error: "Complaint not found" }, status: :not_found
      end
    end

    def create
      complaint = Complaint.new(complaint_params)

      if complaint.save
        render json: complaint, status: :created
      else
        render json: { errors: complaint.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      @complaint = Complaint.find_by(id: params[:id])

      if @complaint.nil?
        render json: { error: "Complaint not found" }, status: :not_found
      elsif @complaint.update(complaint_params)
        render json: @complaint
      else
        render json: { errors: @complaint.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def complaint_params
      params.require(:complaint).permit(:user_id, :status, :complaint_text)
    end
  end
end
