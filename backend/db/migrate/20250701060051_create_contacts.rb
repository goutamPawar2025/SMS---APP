class CreateContacts < ActiveRecord::Migration[7.0]
  def change
    create_table :contacts do |t|
      t.string :email, null: false
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end

    add_index :contacts, [:user_id, :email], unique: true
  end
end
