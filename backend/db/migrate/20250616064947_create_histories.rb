class CreateHistories < ActiveRecord::Migration[8.0]
  def change
    create_table :histories do |t|
      t.references :user, null: false, foreign_key: true
      t.string :campaign_id

      t.timestamps
    end
  end
end
