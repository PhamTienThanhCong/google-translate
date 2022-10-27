const logger = require('../utils/logger');
const auth = require('../models/auth');

function login(req, res) {
  // render the login page
  logger.info('login');
  res.render('login', { title: 'Express' });
}

function login_activity(req, res) {
    // get data from the form
    const { username, password } = req.body;
    // check if the username and password are correct in the database
    auth.findOne({ username, password }, (err, data) => {
        if (err) {
            logger.error(err);
            res.status(500).send("Error");
        } else {
            if (data) {
                var sess = req.session; 
                sess.daDangNhap = true;
                sess.username = data["username"];
                res.redirect('/all-list');
            } else {
                res.redirect('/login');
            }
        }
    });
}

module.exports = {
    login,
    login_activity
}