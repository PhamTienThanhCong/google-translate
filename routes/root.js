const vietnamese_controller = require('../controllers/vietnamese');
const foreign_language_controller = require('../controllers/foreign_language');
const root_controller = require('../controllers/root');
const translate_controller = require('../controllers/translate');


module.exports = (app) => {
  app.route('/list').get(vietnamese_controller.list)
  app.route('/list_en').get(foreign_language_controller.list)
  app.route('/list_trs').get(translate_controller.list)
  app.route('/create').get(root_controller.index)
  app.route('/').get(root_controller.translate)
  app.route('/find').get(root_controller.api_find_word)
  // post method
  app.route('/save').post(root_controller.add)
  app.route('/test').get(root_controller.test)
}
