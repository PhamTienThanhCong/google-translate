const auth_controller = require('../controllers/auth');
const root_controller = require('../controllers/root');
const adminController = require('../controllers/adminController');

module.exports = (app) => {
  app.route('/').get(root_controller.translate)
  app.route('/find').get(root_controller.api_find_word)
  app.route('/vote/:id').get(root_controller.vote)
  app.route('/vote').post(root_controller.addVote)
  app.route('/thankiu/:id').get(root_controller.thankiu)

  app.route('/all-list').get(adminController.allList);
  app.route('/view-vote/:id').get(adminController.viewVote);
  app.route('/create').get(adminController.index)
  app.route('/save').post(adminController.add)
  app.route('/delete/:id').get(adminController.delete_list)
  app.route('/create-langue').get(adminController.listLanguage);
  app.route('/create-langue-action').post(adminController.addLanguage);
  app.route('/deleteLanguage/:id').get(adminController.deleteLanguage);

  app.route('/login').get(auth_controller.login)
  app.route('/logout').get(auth_controller.logout)
  app.route('/login_activity').post(auth_controller.login_activity)
}
