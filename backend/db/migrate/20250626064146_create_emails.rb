class CreateEmails < ActiveRecord::Migration[8.0]
  def change
    create_table :emails do |t|
      t.references :user, null: false, foreign_key: true
      t.string :receiver
      t.string :subject
      t.text :body
      t.string :status

      t.timestamps
    end
  end
end
