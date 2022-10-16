const Translate = require('../models/translate');
const logger = require('../utils/logger');

const list = (req, res) => {
    // find all data from Vietnamese
    Translate.find({}, (err, data) => {
        if (err) {
            logger.error(err);
            return res.status(400).json(err);
        }
        res.json(data);
    });
}

module.exports = {
    list
}
