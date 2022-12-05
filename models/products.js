const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const product = new Schema({
    product_name: String,
    product_desc: String,
    prodct_url: String,
    product_price: String,
  });

module.exports = mongoose.model('products', product)
