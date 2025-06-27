class RemoveGroupNameFromContact < ActiveRecord::Migration[8.0]
  def change
    remove_column :contacts, :group_name, :string
  end
end
