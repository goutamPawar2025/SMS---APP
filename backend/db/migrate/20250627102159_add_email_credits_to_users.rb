class AddEmailCreditsToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :email_credits, :integer
  end
end
