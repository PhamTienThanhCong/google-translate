const logger = require('../utils/logger');
const Product = require('../models/products');
const Carts = require('../models/cart');
const Bills = require('../models/bill')
const { data } = require('../utils/logger');


function checkLogin(req){
    let name = req.session.fullname;
    if (name == undefined){
        name = "";
    }
    return name
}

function getEmail(req){
    let email = req.session.email;
    return email
}

function getBirthday(req){
    let birthday = req.session.birthday;
    return birthday
}

function getPhoneNumber(req){
    let phoneNumber = req.session.phoneNumber;
    return phoneNumber
}

function getAddress(req) {
    let address = req.session.address;
    return address
}

function getProductName(req){
    let product_name = req.session.product_name;
    return product_name;
}

function getQuantity(req) {
    let  cart_product_quantity = req.session. cart_product_quantity
    return  cart_product_quantity;
}

const home = (req, res) => {
    let products = data;
    Product.find({})
        .then(products => {
            products = products.map(products => products.toObject())
            res.render('home/home', {name: checkLogin(req), products: products})
        })
}
const view = (req, res) => {
    return res.render('home/view', {name: checkLogin(req)})
}

const store = (req, res) => {
    return res.render('home/store', {name: checkLogin(req)})
}


const productDetail = (req, res) => {
    const { id } = req.query;
    Product.findById(id, function(err, data){
        if (data){
            let product = data.toObject();
            return res.render('home/productDetail', {name: checkLogin(req), data: product})
        }else{
            return res.send("error")
        }
    })
}

const listProduct = (req, res) => {
    let products = data;
    Product.find({})
        .then(products => {
            products = products.map(products => products.toObject())
            res.render('home/listProduct', {name: checkLogin(req), products: products})
        })
}

const addToCart = (req, res) => {
    const newCart = new Carts(req.body);
    newCart.cart_user_email = getEmail(req);
    newCart.cart_product_quantity = "1";
    newCart.save();
    return res.redirect('/cart');
}


const cart = (req, res) => {
    Carts.find({
        "cart_user_email": getEmail(req)
    })
    .then(products => {
        products = products.map(products => products.toObject())
        res.render('home/cart', {name: checkLogin(req), products: products })
    })
}

const updateCart = async (req, res) => {
    const id = req.params['id'];
    const quantity = req.body.cart_product_quantity
    const cart = await Carts.findOne({_id: id})   
    cart.cart_product_quantity = quantity
    await cart.save()
    res.redirect('/cart')
}



const deleteCart = async (req, res) => {
    const id = req.params['id']
    const cart = await Carts.deleteOne({_id: id})  
    res.redirect('/cart')
}

// const addToBill = (req, res) => {
//     const newBill = new Bills(req.body);
//     newBill.cart_user_email = getEmail(req);
//     newBill.save();
// }

const bill = async (req, res) => {
    const cart = await Carts.find({
        "cart_user_email": getEmail(req)
    })
    for(var i = 0; i < cart.length; i++){
        try {
            let bill = new Bills;
            bill['bill_product_id'] = cart[i]['cart_product_id'];
            bill['bill_product_url'] = cart[i]['cart_product_url'];
            bill['bill_product_name'] = cart[i]['cart_product_name'];
            bill['bill_product_price'] = cart[i]['cart_product_price'];
            bill['bill_product_size'] = cart[i]['cart_product_size'];
            bill['bill_user_email'] = cart[i]['cart_user_email'];
            bill['bill_product_quantity'] = cart[i]['cart_product_quantity'];
            bill['bill_product_status'] = 'Đang vận chuyển'
            await bill.save()
            await Carts.deleteOne({_id: cart[i]['_id']})  
        } catch (error) {
            console.log(error)
        }
    }
    return res.redirect('/bill')
    // res.render('home/bill', {name: checkLogin(req)})
}

const order = (req, res) => {
    Bills.find({
        "bill_user_email": getEmail(req)
    })
    .then(bill => {
        bill = bill.map(bill => bill.toObject())
        res.render('home/bill', {name: checkLogin(req), bill: bill })
    })
}

const account = (req, res) => {
    res.render('home/account', {name: checkLogin(req), email: getEmail(req), birthday: getBirthday(req), phoneNumber: getPhoneNumber(req), address: getAddress(req)})
}


module.exports = {
    home,
    productDetail,
    listProduct,
    view,
    store,
    cart,
    account,
    addToCart,
    updateCart,
    deleteCart,
    bill,
    order
}