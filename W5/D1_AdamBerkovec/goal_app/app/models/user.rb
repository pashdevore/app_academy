class User < ActiveRecord::Base
  attr_reader :password

  validates :username, :password_digest, :session_token, presence: true
  validates :password, length: { minimum: 6, allow_nil: true }

  has_many :goals
  has_many :comments, as :commentable

  after_initialize :ensure_session_token!

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end

  def ensure_session_token!
    self.session_token ||= SecureRandom.hex
  end

  def reset_session_token!
    self.session_token = SecureRandom.hex
    self.save
    self.session_token
  end

  def self.find_by_credentials(username, password)
    user = User.find_by_username(username)
    return nil if user.nil?
    user.is_password?(password) ? user : nil
  end
end
