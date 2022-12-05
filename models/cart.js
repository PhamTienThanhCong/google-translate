const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cart = new Schema({
    cart_user_email: String,
    cart_product_url: String,
    cart_product_name: String,
    cart_product_price: String,
    cart_product_id: String,
    cart_product_size: String,
    cart_product_quantity: String
});

module.exports = mongoose.model('carts', cart)
