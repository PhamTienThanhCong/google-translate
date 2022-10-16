const logger = require('../utils/logger/index');

module.exports = (req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  logger.info(log);
  next();
}
