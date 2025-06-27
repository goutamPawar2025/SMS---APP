class RemoveIsAutoMonthlyFromComplaints < ActiveRecord::Migration[8.0]
  def change
    remove_column :complaints, :is_auto_monthly, :boolean
  end
end
