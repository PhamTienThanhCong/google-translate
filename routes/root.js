const root_controller = require('../controllers/root');
const auth_controller = require('../controllers/auth');

module.exports = (app) => {
  app.route('/create').get(root_controller.index)
  app.route('/').get(root_controller.translate)

  app.route('/list-word').get(root_controller.list_word)

  app.route('/all-list').get(root_controller.allList)
  app.route('/find').get(root_controller.api_find_word)
  app.route('/delete').post(root_controller.delete_list)
  app.route('/create-langue').get(root_controller.listLanguage)
  app.route('/create-langue-action').post(root_controller.addLanguage)
  app.route('/deleteLanguage/:id').get(root_controller.deleteLanguage)

  // post method
  app.route('/save').post(root_controller.add)

  app.route('/logout').get(auth_controller.logout)
  // auth
  app.route('/login').get(auth_controller.login)
  app.route('/login_activity').post(auth_controller.login_activity)
}
