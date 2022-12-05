const userController = require('../controllers/user');
const homeController = require('../controllers/home');


module.exports = (app) => {

  app.route('/productDetail').get(homeController.productDetail)
  app.route('/listProduct').get(homeController.listProduct)  
  app.route('/view').get(homeController.view) 
  app.route('/store').get(homeController.store) 
  app.route('/home').get(homeController.home)
  app.route('/cart').get(homeController.cart)
  app.route('/account').get(homeController.account)
  
  
  app.route('/register').get(userController.register)
  app.route('/login').get(userController.login)
  app.route('/signout').get(userController.signout)
  app.route('/bill').get(homeController.order)
  app.route('/bill').post(homeController.bill)
  
  app.route('/registerProcessing').post(userController.registerProcessing)
  app.route('/loginProcessing').post(userController.loginProcessing)
  app.route('/addToCart').post(homeController.addToCart)
  app.route('/updateCart/:id').post(homeController.updateCart)
  app.route('/deleteCart/:id').post(homeController.deleteCart)

  app.route('/').get(homeController.home)
}
