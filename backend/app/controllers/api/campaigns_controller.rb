# app/controllers/api/campaigns_controller.rb
module Api
  class CampaignsController < ApplicationController

    def index
      if params[:user_id]
        @campaigns = Campaign.where(user_id: params[:user_id])
        render json: @campaigns
      else
        render json: { error: "user_id not provided" }, status: :bad_request
      end
    end

    def show
      @campaign = Campaign.find(params[:id])
      render json: @campaign
    end

    def create
      @campaign = Campaign.new(campaign_params)
      if @campaign.save
        render json: @campaign, status: :created
      else
        render json: { errors: @campaign.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      @campaign = Campaign.find(params[:id])
      if @campaign.update(campaign_params)
        render json: @campaign
      else
        render json: { errors: @campaign.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      @campaign = Campaign.find(params[:id])
      @campaign.destroy
      render json: { message: "Campaign deleted successfully" }
    end

    private

   def campaign_params
  params.require(:campaign).permit(
    :message_content,
    :channel,
    :scheduled_at,
    :is_auto_monthly,
    :status,
    :user_id,
    :message_template_id
  )
end

  end
end
