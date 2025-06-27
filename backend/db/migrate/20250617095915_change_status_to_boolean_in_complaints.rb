class ChangeStatusToBooleanInComplaints < ActiveRecord::Migration[7.0]
  def change
    change_column :complaints, :status, :boolean
  end
end
