class BlessYousController < ApplicationController
  
  def new
    @bless_you = BlessYou.new(params[:bless_you])
  end
  
  def create
    @bless_you = BlessYou.new(params[:bless_you])
    respond_to do |format|
      if @bless_you.save
        cookies[:your_name] =
          { :value => @bless_you.your_name, :expires => 1.year.from_now}
        format.html do
          flash[:notice] = "eBlessYou sent to #{@bless_you.to_email}"
          redirect_to "/"
        end
      else
        format.html do
          render :action => 'new'
        end
      end
    end
    
  end
  
end
