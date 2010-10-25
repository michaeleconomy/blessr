class BlessMailer < ActionMailer::Base
  layout 'mail_layout'
  default :from => "no-reply@blessr.com"
  
  def bless_you_email(bless_you)
    @bless_you = bless_you
    mail(:to => bless_you.to_email,
         :subject => "Bless You")
  end
end
