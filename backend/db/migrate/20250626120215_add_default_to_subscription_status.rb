class AddDefaultToSubscriptionStatus < ActiveRecord::Migration[8.0]
  def change
    change_column_default :subscriptions, :status, from: nil, to: 0
    change_column_null :subscriptions, :status, false
  end
end
