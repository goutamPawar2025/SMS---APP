# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_06_26_120215) do
  create_table "admin_users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_admin_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true
  end

  create_table "campaigns", force: :cascade do |t|
    t.text "message_content"
    t.integer "channel"
    t.datetime "scheduled_at"
    t.boolean "is_auto_monthly"
    t.integer "status"
    t.integer "user_id", null: false
    t.integer "message_template_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["message_template_id"], name: "index_campaigns_on_message_template_id"
    t.index ["user_id"], name: "index_campaigns_on_user_id"
  end

  create_table "collections", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "contact_id", null: false
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["contact_id"], name: "index_collections_on_contact_id"
    t.index ["user_id"], name: "index_collections_on_user_id"
  end

  create_table "complaints", force: :cascade do |t|
    t.integer "user_id", null: false
    t.boolean "status"
    t.text "complaint_text"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_complaints_on_user_id"
  end

  create_table "contacts", force: :cascade do |t|
    t.string "name"
    t.string "phone_number"
    t.integer "age"
    t.integer "gender"
    t.boolean "is_blocked"
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "collection_id"
    t.index ["collection_id"], name: "index_contacts_on_collection_id"
    t.index ["user_id"], name: "index_contacts_on_user_id"
  end

  create_table "credits", force: :cascade do |t|
    t.decimal "amount"
    t.integer "status"
    t.string "payment_method"
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_credits_on_user_id"
  end

  create_table "documents", force: :cascade do |t|
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_documents_on_user_id"
  end

  create_table "emails", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "receiver"
    t.string "subject"
    t.text "body"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_emails_on_user_id"
  end

  create_table "export_data", force: :cascade do |t|
    t.string "file_name"
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_export_data_on_user_id"
  end

  create_table "histories", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "campaign_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_histories_on_user_id"
  end

  create_table "message_templates", force: :cascade do |t|
    t.string "title"
    t.text "content"
    t.integer "channel"
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_message_templates_on_user_id"
  end

  create_table "notifications", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "title"
    t.text "body"
    t.boolean "is_read"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "orders", force: :cascade do |t|
    t.decimal "amount"
    t.integer "status"
    t.string "payment_method"
    t.boolean "is_auto_monthly"
    t.integer "user_id", null: false
    t.integer "campaign_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campaign_id"], name: "index_orders_on_campaign_id"
    t.index ["user_id"], name: "index_orders_on_user_id"
  end

  create_table "payments", force: :cascade do |t|
    t.decimal "amount"
    t.integer "status"
    t.string "payment_method"
    t.boolean "is_auto_monthly"
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_payments_on_user_id"
  end

  create_table "subscriptions", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "status", default: 0
    t.datetime "end_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_subscriptions_on_user_id"
  end

  create_table "templates", force: :cascade do |t|
    t.string "name"
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "full_name"
    t.string "email"
    t.string "phone_number"
    t.text "password_hash"
    t.boolean "verified"
    t.text "gov_doc_path"
    t.boolean "gov_doc_status"
    t.integer "preferred_channel"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "provider"
    t.string "uid"
    t.string "jti"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "campaigns", "message_templates"
  add_foreign_key "campaigns", "users"
  add_foreign_key "collections", "contacts"
  add_foreign_key "collections", "users"
  add_foreign_key "complaints", "users"
  add_foreign_key "contacts", "collections"
  add_foreign_key "contacts", "users"
  add_foreign_key "credits", "users"
  add_foreign_key "documents", "users"
  add_foreign_key "emails", "users"
  add_foreign_key "export_data", "users"
  add_foreign_key "histories", "users"
  add_foreign_key "message_templates", "users"
  add_foreign_key "notifications", "users"
  add_foreign_key "orders", "campaigns"
  add_foreign_key "orders", "users"
  add_foreign_key "payments", "users"
  add_foreign_key "subscriptions", "users"
end
