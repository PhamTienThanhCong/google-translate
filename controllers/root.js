const logger = require('../utils/logger');
const Vietnamese = require('../models/vietnam');
const Foreign_language = require('../models/foreign_language');
const Translate = require('../models/translate');
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

const index = (req, res) => {
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
  // get all data from Vietnamese and Foreign_language
  const data = await list(Vietnamese);
  const data2 = await list(Foreign_language);
  const data3 = await list(Translate);

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

// find element in Translate by id_tv and return list id_tt
const find_translates = async (type, value, language) => {
  try {
    const data = await language.find({id_tv: value});
    return data;
  } catch (error) {
    logger.error(error);
  }
}

const find_translates2 = async (type, value, language) => {
  try {
    const data = await language.find({id_tt: value});
    return data;
  } catch (error) {
    logger.error(error);
  }
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
  const data = await list(type_API);
  id = checkExist(word, data);
  
  // let data_translate = await list(Translate);
  let id2 = [];
  if (type == "1") {
    id2 = await find_translates(1, id, Translate);
  }else if (type == "2") {
    id2 = await find_translates2(2, id, Translate);
  }

  let list_anouce = [];
  let list_word = await list(type_API2);
  for (let i = 0; i < id2.length; i++) {
    for (let j = 0; j < list_word.length; j++) {
      if (id2[i][type_id2] == list_word[j]._id) {
        list_anouce.push(list_word[j]);
      }
    }
  }

  res.send(list_anouce);
}

// check if word exist in list if exist return list._id else return null using map 
const checkExist = (word, list) => {
  let id = "";
  list.map( (item) => {
    if (item.word === word) {
      id = item._id;        
    }
  });
  return id;
}

// add new value to Vietnamese and Foreign_language 
const add = async (req, res) => {
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
  let id_tv = checkExist(text1, await list(Vietnamese));
  let id_tt = checkExist(text2, await list(Foreign_language));
  
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

module.exports = {
  index,
  add,
  translate,
  allList,
  api_find_word,
}
