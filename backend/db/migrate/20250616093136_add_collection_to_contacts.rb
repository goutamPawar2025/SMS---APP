class AddCollectionToContacts < ActiveRecord::Migration[8.0]
  def change
    add_reference :contacts, :collection, null: true, foreign_key: true
  end
end