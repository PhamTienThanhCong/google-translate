const logger = require('../utils/logger');
const my_function = require('./function');
const Vietnamese = require('../models/vietnam');
const Foreign_language = require('../models/foreign_language');
const Translate = require('../models/translate');
const { exists } = require('../models/vietnam');

const index = (req, res) => {
  if (!req.session.daDangNhap){
    res.redirect('/login');
  }
  // render the index page
  logger.info('index');
  res.render('index', { title: 'Express' });
}
const translate = (req, res) => {
  // render the index page
  logger.info('find_word');
  res.render('find_word', { title: 'Express' });
}

const allList = async (req, res) => {
  if (!req.session.daDangNhap){
    res.redirect('/login');
  }
  // get all data from Vietnamese and Foreign_language
  const data = await my_function.list(Vietnamese);
  const data2 = await my_function.list(Foreign_language);
  const data3 = await my_function.list(Translate);

  let dictionary = [];

  let word1, word2, description, id;
  for (let i = 0; i < data3.length; i++) {
    id = data3[i]['_id'];
    
    for (let j = 0; j < data.length; j++) {
      if (data3[i]['id_tv'] == data[j]['_id']) {
        word1 = data[j]['word'];
      }
    }
    for (let j = 0; j < data2.length; j++) {
      if (data3[i]['id_tt'] == data2[j]['_id']) {
        word2 = data2[j]['word'];
        description = data2[j]['description'];
      }
    }

    dictionary.push({
      "id": id,
      "tv": word1,
      "tt": word2,
      "description": description
    });
  }
  // render the page and send data to the page
  res.render('allList', { title: 'Express', dictionary });
}

// write function api_find_word(req, res) 
const api_find_word = async (req, res) => {
  let { type, word } = req.query;
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
        list_anouce.push(list_word[j]);
      }
    }
  }

  res.send(list_anouce);
}

// add new value to Vietnamese and Foreign_language 
const add = async (req, res) => {
  if (!req.session.daDangNhap){
    res.redirect('/login');
  }
  // get the data from the request
  let { type, text1, text2, description } = req.body;
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
  addList(text1, text2, description);

  // redirect to another page
  res.redirect('/create');
}

const addList = async (text1, text2, description) => {
  if (!req.session.daDangNhap){
    res.redirect('/login');
  }

  let id_tv = my_function.checkExist(text1, await my_function.list(Vietnamese));
  let id_tt = my_function.checkExist(text2, await my_function.list(Foreign_language));
  
  if (id_tv === "" || id_tt === "") {
    // create a new document
    // add new value to Vietnamese
    if (id_tv === "") {
      const vietnamese_document = new Vietnamese({ word: text1 });
      vietnamese_document.save();
      id_tv = vietnamese_document._id;
    }  

    // add new value to Foreign_language
    if (id_tt === "") {
      const foreign_language_document = new Foreign_language({ word: text2, description: description });
      foreign_language_document.save();
      id_tt = foreign_language_document._id;
    }

    // add new value to Translate
    const translate_document = new Translate({ 
      "id_tv": id_tv, 
      "id_tt": id_tt 
    });
    translate_document.save();
  }

}

const delete_list = async (req, res) => {
  if (!req.session.daDangNhap){
    res.redirect('/login');
  }

  let { id } = req.body;
  let word = my_function.find_word(id, Translate);
  let id_tv = word.id_tv;
  let id_tt = word.id_tt;
  await Translate.deleteOne({ _id: id });

  // count number of id_tv and id_tt in Translate
  let count_tv = await my_function.count(id_tv, Translate);
  let count_tt = await my_function.count2(id_tt, Translate);

  if (count_tv === 0) {
    await Vietnamese.deleteOne({ _id: id_tv });
  }
  if (count_tt === 0) {
    await Foreign_language.deleteOne({ _id: id_tt });
  }
  res.redirect('/all-list');
}

module.exports = {
  index,
  add,
  translate,
  allList,
  delete_list,
  api_find_word,
}
