class CreateCampaigns < ActiveRecord::Migration[8.0]
  def change
    create_table :campaigns do |t|
      t.text :message_content
      t.integer :channel
      t.datetime :scheduled_at
      t.boolean :is_auto_monthly
      t.integer :status
      t.references :user, null: false, foreign_key: true
      t.references :template, null: false, foreign_key: true

      t.timestamps
    end
  end
end
