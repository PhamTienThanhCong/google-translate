const logger = require('../utils/logger');

// write function return all data from Vietnamese using async/await
const list = async (language) => {
    try {
        const data = await language.find();
        return data;
    } catch (error) {
        logger.error(error);
    }
};

// find element in Vietnamese by _id and return word
const find_word = async (id, language) => {
    try {
        const data = await language.findById(id);
        return data;
    } catch (error) {
        logger.error(error);
    }
};

// find element in Translate by id_tv and return list id_tt
const find_translates = async (type, value, language) => {
    try {
        const data = await language.find({ id_tv: value });
        return data;
    } catch (error) {
        logger.error(error);
    }
}

const find_translates2 = async (type, value, language) => {
    try {
        const data = await language.find({ id_tt: value });
        return data;
    } catch (error) {
        logger.error(error);
    }
}

// check if word exist in list if exist return list._id else return null using map 
const checkExist = (word, list) => {
    let id = "";
    list.map((item) => {
        if (item.word === word) {
            id = item._id;
        }
    });
    return id;
}

// count number of id_tv and id_tt in Translate
const count = async (value) => {
    try {
        const data = await Translate.find({ id_tv: value });
        return data.length;
    } catch (error) {
        logger.error(error);
    }
}
const count2 = async (value) => {
    try {
        const data = await Translate.find({ id_tt: value });
        return data.length;
    } catch (error) {
        logger.error(error);
    }
}

module.exports = {
    list,
    find_word,
    find_translates,
    find_translates2,
    checkExist,
    count,
    count2
}