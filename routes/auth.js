const auth_controller = require('../controllers/auth');

module.exports = (app) => {
    app.route('/logout').get(auth_controller.logout)
    // auth
    app.route('/login').get(auth_controller.login)
    app.route('/login_activity').post(auth_controller.login_activity)
}