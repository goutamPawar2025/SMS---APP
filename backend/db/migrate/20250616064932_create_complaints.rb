class CreateComplaints < ActiveRecord::Migration[8.0]
  def change
    create_table :complaints do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :status
      t.text :complaint_text
      t.boolean :is_auto_monthly

      t.timestamps
    end
  end
end
