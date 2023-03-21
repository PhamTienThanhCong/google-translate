const Translate = require('../models/translate');
const Language = require('../models/language');

const allList = async (req, res) => {
    let { keyword } = req.query;
    if (keyword == undefined) {
        keyword = "";
    }
    // Lấy data từ database translate sao cho korea không xuất hiện trùng nhau
    const data = await Translate.find({ korea: { $regex: keyword, $options: 'i' } }).distinct('korea');
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
    const { text1, text2, language, description } = req.body;
    const language_id = language.split('&')[0];
    const language_name = language.split('&')[1];
    const text1_trim = text1.trim().replace(/\s\s+/g, ' ').toLowerCase();
    const text2_trim = text2.trim().replace(/\s\s+/g, ' ').toLowerCase();
    if (text1_trim == "" || text2_trim == "") {
        return res.redirect('/create');
    }
    const TranslateText = await Translate.findOne({ korea: text1_trim, foreign_languages: text2_trim, language: language_id });
    
    if (!TranslateText) {
        const newTranslate = new Translate({
            korea: text1_trim,
            foreign_languages: text2_trim,
            language: language_id,
            language_name: language_name,
            description: description,
        });
        try {
            await newTranslate.save();
        } catch (error) {}
    }
    return res.redirect('/create');
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
    if (name == "") {
        return res.redirect('/create-langue');
    }
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