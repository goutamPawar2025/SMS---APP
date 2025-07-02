module Api
  class CollectionsController < ApplicationController

    def index
      collections = Collection.where(user_id: params[:user_id])
      render json: collections
    end

    def show
      collection = Collection.includes(:contacts).find(params[:id])
      render json: {
        id: collection.id,
        name: collection.name,
        user_id: collection.user_id,
        contacts: collection.contacts.as_json(only: [:id, :email])
      }
    end

    def create
      collection = Collection.new(name: params[:name], user_id: params[:user_id])

      if collection.save
        collection.contact_ids = params[:contact_ids] if params[:contact_ids].present?
        render json: collection, status: :created
      else
        render json: { errors: collection.errors.full_messages }, status: :unprocessable_entity
      end
    end

     def update
      collection = Collection.find(params[:id])

      if params[:contact_ids].present?
        collection.contact_ids = (collection.contact_ids + params[:contact_ids].map(&:to_i)).uniq
      end

      collection.name = params[:name] if params[:name].present?

      if collection.save
        render json: collection, status: :ok
      else
        render json: { errors: collection.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      collection = Collection.find(params[:id])
      collection.destroy
      render json: { message: "Collection deleted" }
    end

    private

    def collection_params
      params.permit(:name, :user_id, contact_ids: [])
    end

  end
end
