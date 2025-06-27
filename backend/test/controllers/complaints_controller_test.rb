require "test_helper"

class ComplaintsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get complaints_index_url
    assert_response :success
  end

  test "should get create" do
    get complaints_create_url
    assert_response :success
  end

  test "should get update" do
    get complaints_update_url
    assert_response :success
  end

  test "should get destroy" do
    get complaints_destroy_url
    assert_response :success
  end
end
