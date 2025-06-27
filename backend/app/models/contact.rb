class Contact < ApplicationRecord
  belongs_to :user
  belongs_to :collection, optional: true
end
