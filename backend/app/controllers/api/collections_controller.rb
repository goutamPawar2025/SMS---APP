module Api
  class CollectionsController < ApplicationController
    def index
       collectioncount = Collection.count
      render json: [
  { name: 'Total Collections', value: collectioncount }
]
    end

    def show
      collection = Collection.find(params[:id])
      render json: collection
    end

    def create
      collection = Collection.new(collection_params)
      if collection.save
        render json: collection, status: :created
      else
        render json: { errors: collection.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      collection = Collection.find(params[:id])
      if collection.update(collection_params)
        render json: collection
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
     params.permit(:name, :user_id, :contact_id)
    end
  end
end
