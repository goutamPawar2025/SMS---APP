module Api
  class MessageTemplatesController < ApplicationController
    def index
       if params[:user_id]
        @templates = MessageTemplate.where(user_id: params[:user_id])
        render json: @templates
      else
        render json: { error: "user_id not provided" }, status: :bad_request
      end
    end

    def show
      @template = MessageTemplate.find(params[:id])
      render json: @template
    end

    def create
       @template = MessageTemplate.new(template_params)
      if @template.save
        render json: @template, status: :created
      else
        render json: { errors: @template.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      @template = MessageTemplate.find(params[:id])
      if @template.update(template_params)
        render json: @template
      else
        render json: { errors: @template.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      @template = MessageTemplate.find(params[:id])
      @template.destroy
      render json: { message: "Deleted successfully" }
    end

    private

    def template_params
      params.require(:message_template).permit(:user_id, :title, :content)
    end
  end
end
