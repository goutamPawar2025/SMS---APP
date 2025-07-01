class RemoveContactIdFromCollections < ActiveRecord::Migration[8.0]
  def change
    remove_column :collections, :contact_id, :integer
  end
end
