const logger = require('../utils/logger');
const my_function = require('./function');
const Vietnamese = require('../models/vietnam');
const Foreign_language = require('../models/foreign_language');
const Translate = require('../models/translate');
const Language  = require('../models/language');

// languages
const getLanguage = async () => {
  // get getLanguage from database language
  try {
      const data = await Language.find({});
      return data;
  } catch (error) {
      logger.error(error);
  }

}
// add new language 
const listLanguage = async (req, res) => {
  try {
    if (!req.session.daDangNhap){
      return res.redirect('/login');
    }
    const languages = await getLanguage();
    res.render('list_language', { languages });
  } catch (error) {
    logger.error(error);
  }
}

const addLanguage = async (req, res) => {
    // create new language from req
    if (!req.session.daDangNhap){
      return res.redirect('/login');
    }
    const { name, description } = req.body;
    const newLanguage = new Language({
        name,
        description,
    });
    // save new language to database
    try {
      await newLanguage.save();
    } catch (error) {
      logger.error(error);
    }
    // redirect to list language page
    return res.redirect('/create-langue');
}

// delete language
const deleteLanguage = async (req, res) => {
  const { id } = req.params;
  try {
    await Language.findByIdAndDelete(id);
  } catch (error) {
    logger.error(error);
  }
  return res.redirect('/create-langue');
}

const index = async (req, res) => {
  if (!req.session.daDangNhap){
    return res.redirect('/login');
  }
  // render the index page
  logger.info('index');
  let languages = await getLanguage();
  res.render('index', { languages });
}

const translate = async (req, res) => {
  // render the index page
  logger.info('find_word');
  let languages = await getLanguage();
  res.render('find_word', { languages });
}

const allList = async (req, res) => {
  if (!req.session.daDangNhap){
    return res.redirect('/login');
  }
  let {keyword} = req.query;
  if (keyword == undefined){
    keyword = "";
  }
  // search in Vietnamese from word 
  let data_raw = await my_function.list(Vietnamese);
  let data = [];
  console.log(keyword);
  for (let i = 0; i < data_raw.length; i++) {
    if (data_raw[i].word.includes(keyword)){
      data.push(data_raw[i]);
    }
  }
  // get all data from Vietnamese and Foreign_language
  let languages = await getLanguage();
  res.render('allList', { data , keyword, languages: languages });
}

// write function api_find_word(req, res) 
const api_find_word = async (req, res) => {
  let { type, word, language } = req.query;
  let id = "", type_API,type_API2, type_id, type_id2;
  if (type === "1") {
    type_API = Vietnamese;
    type_API2 = Foreign_language;
    type_id = "id_tv";
    type_id2 = "id_tt";
  }else if (type === "2") {
    type_API = Foreign_language;
    type_API2 = Vietnamese;
    type_id = "id_tt";
    type_id2 = "id_tv";
  }
  // trim text and lower case and remove special characters
  word = word.trim().toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
  // find word in Vietnamese 
  const data = await my_function.list(type_API);
  id = my_function.checkExist(word, data);
  
  // let data_translate = await list(Translate);
  let id2 = [];
  if (type == "1") {
    id2 = await my_function.find_translates(1, id, Translate);
  }else if (type == "2") {
    id2 = await my_function.find_translates2(2, id, Translate);
  }

  let list_anouce = [];
  let list_word = await my_function.list(type_API2);
  for (let i = 0; i < id2.length; i++) {
    for (let j = 0; j < list_word.length; j++) {
      if (id2[i][type_id2] == list_word[j]._id) {
        if (language != '0' && type == 1){
          if (list_word[j]['language'] == language){
            list_anouce.push({
              id_trans : id2[i]['_id'],
              _id : list_word[j]['_id'],
              word : list_word[j]['word'],
              description : list_word[j]['description']
            });
          }
        }else{
          list_anouce.push({
            id_trans : id2[i]['_id'],
            _id : list_word[j]['_id'],
            word : list_word[j]['word'],
            description : list_word[j]['description']
          }); 
        }
      }
    }
  }

  res.send(list_anouce);
}

// add new value to Vietnamese and Foreign_language 
const add = async (req, res) => {
  if (!req.session.daDangNhap){
    return res.redirect('/login');
  }
  // get the data from the request
  let { type, text1, text2, language, description } = req.body;
  if (type === 2){
    // swap text1 and text2
    const temp = text1;
    text1 = text2;
    text2 = temp;
  }

  // trim text1 and text2 and lower case and remove special characters
  text1 = text1.trim().toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
  text2 = text2.trim().toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');

  // add new value to Vietnamese and Foreign_language
  addList(text1, text2, language, description);

  // redirect to another page
  res.redirect('/create');
}

const addList = async (text1, text2, language, description) => {

  let id_tv = my_function.checkExist(text1, await my_function.list(Vietnamese));
  let id_tt = my_function.checkExist(text2, await my_function.list(Foreign_language));
  
  if (id_tv === "" || id_tt === "") {
    // create a new document
    // add new value to Vietnamese
    if (id_tv === "") {
      const vietnamese_document = new Vietnamese({ word: text1 });
      try {
        await vietnamese_document.save();
      } catch (error) {
        logger.error(error);
      }
      id_tv = vietnamese_document._id;
    }  

    // add new value to Foreign_language
    if (id_tt === "") {
      const foreign_language_document = new Foreign_language({ word: text2, description: description, language: language });
      try {
        await foreign_language_document.save();
      } catch (error) {
        logger.error(error);
      }
      id_tt = foreign_language_document._id;
    }

    // add new value to Translate
    const translate_document = new Translate({ 
      "id_tv": id_tv, 
      "id_tt": id_tt 
    });
    try {
      await translate_document.save();
    } catch (error) {
      logger.error(error);
    }
  }

}

const delete_list = async (req, res) => {
  if (!req.session.daDangNhap){
    return res.send({
      status : false,
    });
  }

  let { id } = req.body;
  let word = await my_function.find_word(id, Translate);
  let id_tv = word.id_tv;
  let id_tt = word.id_tt;
  
  try {
    await Translate.deleteOne({ _id: id });
  } catch (error) {
    logger.error(error);
  }

  // count number of id_tv and id_tt in Translate
  let count_tv = await my_function.count(id_tv, Translate);
  let count_tt = await my_function.count2(id_tt, Translate);

  console.log(count_tv, count_tt);

  let tv_delete = false;

  if (count_tv == 0) {
    try {
      await Vietnamese.deleteOne({ _id: id_tv });
    } catch (error) {
      logger.error(error);
    }
    tv_delete = true;
  }
  if (count_tt == 0) {
    try {
      await Foreign_language.deleteOne({ _id: id_tt });
    } catch (error) {
      logger.error(error);
    }
  }
  return res.send({
    status : true,
    id_trans: id,
    tv_delete: tv_delete,
    id_tv: id_tv
  });
}

module.exports = {
  index,
  add,
  translate,
  allList,
  delete_list,
  api_find_word,
  addLanguage,
  listLanguage,
  deleteLanguage,
}
