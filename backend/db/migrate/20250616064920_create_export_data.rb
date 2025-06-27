class CreateExportData < ActiveRecord::Migration[8.0]
  def change
    create_table :export_data do |t|
      t.string :file_name
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
