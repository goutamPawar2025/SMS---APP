class AddCreditsToSubscriptions < ActiveRecord::Migration[8.0]
  def change
    add_column :subscriptions, :credits, :integer
  end
end
