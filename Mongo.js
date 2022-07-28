import mongoose from 'mongoose';
const { Schema } = mongoose;

const productsSchema = new Schema({
  id:  Number,
  name: Number,
  slogan:   String,
  description: String,
  category: String,
  default_price:  Number
});

const featuresSchema = new Schema({
  id:   Number,
  product_id:Number,
  feature:   String,
  value: String
});

const photosSchema = new Schema({
  id:  Number,
  styleid: Number,
  thumbnail_url:   String,
  url: String
});

const cartSchema = new Schema({
  id:  Number,
  product_id:  Number,
  user_session: Number,
  active:  Number
});

const relatedSchema = new Schema({
  id:  Number,
  current_product_id:  Number,
  related_product_id : Number,
});

const skusSchema = new Schema({
  id:  Number,
  product_id:  Number,
  user_session: Number,
  active:  Number
});


