class RenameTemplateIdToMessageTemplateIdInCampaigns < ActiveRecord::Migration[7.1]
  def change
    rename_column :campaigns, :template_id, :message_template_id
  end
end
