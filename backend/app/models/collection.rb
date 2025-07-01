class Collection < ApplicationRecord
  belongs_to :user

  has_many :collection_contacts, dependent: :destroy
  has_many :contacts, through: :collection_contacts
end