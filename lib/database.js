const mongoose = require('mongoose');
const config = require('../config/index');
const connection = mongoose.connect(`${config.database.uri}/${config.database.database_name}`);
const logger = require('../utils/logger/index');

connection
  .then((db) => {
    logger.info(
      `Successfully connected to ${config.database.uri} MongoDB cluster in ${
        config.server.environment
      } mode.`,
    );
    return db;
  }, (err) => {
    if(err.message.code === 'ETIMEDOUT'){
      logger.info('Attempting to re-establish database connection.');
			mongoose.connect(config.database.uri);
    } else {
			logger.error('Error while attempting to connect to database:');
			logger.error(err);
		}
  })

module.exports = connection;
