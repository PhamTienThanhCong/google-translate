const root_controller = require('../controllers/root');
const auth_controller = require('../controllers/auth');
const adminController = require('../controllers/adminController');

module.exports = (app) => {
  app.route('/').get(root_controller.translate)
  app.route('/list-word').get(root_controller.list_word)
  app.route('/find').get(root_controller.api_find_word)
  app.route('/delete').post(root_controller.delete_list)
  app.route('/vote/:id').get(root_controller.vote)
  app.route('/vote').post(root_controller.addVote)
  app.route('/thankiu/:id').get(root_controller.thankiu)

  app.route('/all-list').get(adminController.allList);
  app.route('/create').get(adminController.index)
  app.route('/save').post(adminController.add)
  app.route('/create-langue').get(adminController.listLanguage);
  app.route('/create-langue-action').post(adminController.addLanguage);
  app.route('/deleteLanguage/:id').get(adminController.deleteLanguage);

  app.route('/logout').get(auth_controller.logout)
  // auth
  app.route('/login').get(auth_controller.login)
  app.route('/login_activity').post(auth_controller.login_activity)
}
