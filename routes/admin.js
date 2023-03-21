const adminController = require('../controllers/adminController');

module.exports = (app) => {
    app.route('/all-list').get(adminController.allList);
    
    app.route('/create').get(adminController.index)
    app.route('/save').post(adminController.add)
    
    app.route('/create-langue').get(adminController.listLanguage);
    app.route('/create-langue-action').post(adminController.addLanguage);
    app.route('/deleteLanguage/:id').get(adminController.deleteLanguage);
}