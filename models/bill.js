const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bill = new Schema({
    bill_user_email: String,
    bill_product_url: String,
    bill_product_name: String,
    bill_product_price: String,
    bill_product_id: String,
    bill_product_size: String,
    bill_product_quantity: String,
    bill_product_status: String,
});

module.exports = mongoose.model('bills', bill)
