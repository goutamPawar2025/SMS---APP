class Contact < ApplicationRecord
  belongs_to :user

  has_many :collection_contacts, dependent: :destroy
  has_many :collections, through: :collection_contacts

  validates :email, presence: true, uniqueness: { scope: :user_id }
end
