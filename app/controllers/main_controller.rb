class MainController < ApplicationController
  
  def index
    @bless_you = BlessYou.new
    @bless_yous = BlessYou.paginate :page => params[:page]
  end
end
