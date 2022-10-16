const Vietnamese = require('../models/vietnam');
const logger = require('../utils/logger');

const list = (req, res) => {
    // find all data from Vietnamese
    Vietnamese.find({}, (err, vietnamese) => {
        if (err) {
            logger.error(err);
            return res.status(400).json(err);
        }
        res.json(vietnamese);
    });
}

module.exports = {
    list
}
