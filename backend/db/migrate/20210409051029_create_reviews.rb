# OK
class CreateReviews < ActiveRecord::Migration[6.0]
  def change
    create_table :reviews do |t|
      t.references :user, null: false, foreign_key: true
      t.references :post, null: false, foreign_key: true
      t.string :title
      t.text :content
      t.float :rate
      t.string :image

      t.timestamps

      t.index %i[user_id post_id], unique: true
    end
  end
end
