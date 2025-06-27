require "test_helper"

class MessageTemplateControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get message_template_index_url
    assert_response :success
  end

  test "should get create" do
    get message_template_create_url
    assert_response :success
  end

  test "should get update" do
    get message_template_update_url
    assert_response :success
  end

  test "should get destroy" do
    get message_template_destroy_url
    assert_response :success
  end
end
