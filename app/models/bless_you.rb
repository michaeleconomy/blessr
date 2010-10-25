class BlessYou < ActiveRecord::Base
  
  validates_format_of :to_email, :with => EMAIL_REGEXP
  validates_length_of :your_name, :minimum => 1
  after_create :send_mail
  
  def send_mail
    BlessMailer.bless_you_email(self).deliver
    
    true
  end
  
end
