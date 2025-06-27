class ChangeCollectionIdNullOnContacts < ActiveRecord::Migration[8.0]
  def change
    change_column_null :contacts, :collection_id, true
  end
end
