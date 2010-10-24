class BlessrFormBuilder < ActionView::Helpers::FormBuilder
  include ActionView::Helpers::TagHelper
  class_eval do
    %w(text_field password_field text_area).each do |name|
      define_method name do |args|
        attribute, options = args
        content_tag(:div, label(attribute) + super)
      end
    end
  end
end