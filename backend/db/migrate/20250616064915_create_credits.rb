class CreateCredits < ActiveRecord::Migration[8.0]
  def change
    create_table :credits do |t|
      t.decimal :amount
      t.integer :status
      t.string :payment_method
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
