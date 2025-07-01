class CollectionContact < ApplicationRecord
  belongs_to :collection
  belongs_to :contact
end
