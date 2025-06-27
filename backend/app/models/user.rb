class User < ApplicationRecord
    attribute :email_credits, :integer, default: 0

    before_create :generate_jti

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, :omniauthable,
         jwt_revocation_strategy: Devise::JWT::RevocationStrategies::Null,
         omniauth_providers: [:google_oauth2]

  has_many :contacts, dependent: :destroy
  has_many :emails

  def self.from_omniauth(auth)
    where(email: auth.info.email).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0, 20]
      user.name = auth.info.name
    end
  end

  def generate_jti
    self.jti ||= SecureRandom.uuid
  end
end
