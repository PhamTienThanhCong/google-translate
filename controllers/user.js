const Users = require('../models/user');
const logger = require('../utils/logger');
const Carts = require('../models/cart');

const register = (req, res) => {
    return res.render('auth/register', {name: ""})
}


const login = (req, res) => {
    let alert_m = req.session.alert_m;
    req.session.alert_m = "";
    if (req.session.fullname != undefined){
        alert_m = `Chào ${req.session.fullname} đã đăng nhập rùi nhé đừng đăng nhập lại `
        console.log(req.session)
    }
    return res.render('auth/login', {alert_m: alert_m, name: ""})
}

const addProduct = (req, res) => {
    const newCart = new Carts(req.body);
    newCart.save();
}

const registerProcessing = (req, res) => {
    const newUser = new Users(req.body);
    newUser.save();
    return res.redirect('/login');
}


const loginProcessing = (req, res) => {
    Users.findOne(req.body , (err, data) => {
        if (err){
            return res.send("404 khong tim thay")
        }
        else{
            if(data){
                let root = req.session;
                root.id = data._id;
                root.fullname = data.fullname;
                root.email = data.email;
                root.birthday = data.birthday;
                root.phoneNumber = data.phoneNumber;
                root.address = data.address;
                root.save();
                return res.redirect('/')
            }else{
                req.session.alert_m = "Bạn đã nhập sai tk hoặc mk rùi :3";
                return res.redirect('/login');
            }
        }
    });
}

const signout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
}

const cart = (req, res) => {
    res.render('home/cart', {name: checkLogin(req)})
}

module.exports = {
    register,
    login,
    registerProcessing,
    loginProcessing,
    signout,
    cart
}
