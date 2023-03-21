const Foreign_language = require('../models/word');
const Translate = require('../models/translate');
const Language = require('../models/language');

// const loginCheck(req, res){
//     if (!req.session.daDangNhap) {
//         res.redirect('/login');
//         // exit app
//         process.exit(1);
//     }
// }

const allList = async (req, res) => {
    let { keyword } = req.query;
    if (keyword == undefined) {
        keyword = "";
    }
    let data = [];
    let languages = await Language.find({});
    res.render('allList', { data, keyword, languages: languages });
}
// create langue
const index = async (req, res) => {
    // render the index page
    let languages = await Language.find({});
    res.render('index', { languages });
}

// function get data from post request
const add = async (req, res) => {
    // get data from post request
    const { text1, text2, language, description } = req.body;
    res.send({ text1, text2, language, description });
}

// add new language 
const listLanguage = async (req, res) => {
    try {
        // if (!req.session.daDangNhap) {
        //     return res.redirect('/login');
        // }
        const languages = await Language.find({});
        res.render('list_language', { languages });
    } catch (error) {
    }
}

const addLanguage = async (req, res) => {
    const { name, description } = req.body;
    const newLanguage = new Language({
        name,
        description,
    });
    // save new language to database
    try {
        await newLanguage.save();
    } catch (error) {
    }
    // redirect to list language page
    return res.redirect('/create-langue');
}

const deleteLanguage = async (req, res) => {
    const { id } = req.params;
    try {
        await Language.findByIdAndDelete(id);
    } catch (error) {
    }
    return res.redirect('/create-langue');
}


module.exports = {
    allList,
    index,
    add,
    listLanguage,
    addLanguage,
    deleteLanguage,
};