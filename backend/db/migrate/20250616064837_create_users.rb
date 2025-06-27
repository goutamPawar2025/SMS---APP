class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :full_name
      t.string :email
      t.string :phone_number
      t.text :password_hash
      t.boolean :verified
      t.text :gov_doc_path
      t.boolean :gov_doc_status
      t.integer :preferred_channel

      t.timestamps
    end
  end
end
