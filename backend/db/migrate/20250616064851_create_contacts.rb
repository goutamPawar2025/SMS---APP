class CreateContacts < ActiveRecord::Migration[8.0]
  def change
    create_table :contacts do |t|
      t.string :name
      t.string :phone_number
      t.integer :age
      t.integer :gender
      t.boolean :is_blocked
      t.references :user, null: true, foreign_key: true
      t.timestamps
    end
  end
end
