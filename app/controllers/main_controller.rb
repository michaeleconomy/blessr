class MainController < ApplicationController
  
  def index
    @bless_you = BlessYou.new(:your_name => cookies[:your_name])
    @bless_yous = BlessYou.paginate :page => params[:page]
  end
end
