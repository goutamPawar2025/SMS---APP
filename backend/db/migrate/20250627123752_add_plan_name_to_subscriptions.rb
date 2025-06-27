class AddPlanNameToSubscriptions < ActiveRecord::Migration[8.0]
  def change
    add_column :subscriptions, :plan_name, :string
  end
end
