class AddPaymentIdToSubscriptions < ActiveRecord::Migration[8.0]
  def change
    add_column :subscriptions, :payment_id, :string
  end
end
