class CreateCollectionContacts < ActiveRecord::Migration[8.0]
  def change
    create_table :collection_contacts do |t|
      t.references :collection, null: false, foreign_key: true
      t.references :contact, null: false, foreign_key: true

      t.timestamps
    end
  end
end
