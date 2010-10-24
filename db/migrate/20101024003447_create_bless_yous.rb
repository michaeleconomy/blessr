class CreateBlessYous < ActiveRecord::Migration
  def self.up
    create_table :bless_yous do |t|
      t.string :your_name, :limit => 256
      t.string :to_name, :limit => 256
      t.string :to_email, :limit => 256
      t.text :message
      t.timestamps
    end
  end

  def self.down
    drop_table :bless_yous
  end
end
