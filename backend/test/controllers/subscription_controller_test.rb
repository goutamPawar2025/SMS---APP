require "test_helper"

class SubscriptionControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get subscription_index_url
    assert_response :success
  end

  test "should get create" do
    get subscription_create_url
    assert_response :success
  end

  test "should get update" do
    get subscription_update_url
    assert_response :success
  end
end
