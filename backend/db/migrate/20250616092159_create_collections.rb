class CreateCollections < ActiveRecord::Migration[8.0]
  def change
    create_table :collections do |t|
      t.references :user, null: true, foreign_key: true
      t.references :contact, null: true, foreign_key: true
      t.string :name
      t.timestamps
    end
  end
end
