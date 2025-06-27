class FixTemplateReferenceInCampaigns < ActiveRecord::Migration[8.0]
  def change
    # Only add the correct reference if not already present
    unless column_exists?(:campaigns, :message_template_id)
      add_reference :campaigns, :message_template, null: false, foreign_key: true
    end
  end
end
