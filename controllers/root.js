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

// write function test(req, res) get data from list_tv and render it
const test = async (req, res) => {
  const data = await list_tv();
  res.send( checkExist("công", data) );
}

// write function api_find_word(req, res) 
const api_find_word = async (req, res) => {
  let { type, word } = req.query;
  let id = "";
  // trim text and lower case and remove special characters
  word = word.trim().toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
  // find word in Vietnamese 
  if (type == 1) {
    const data = await list(Vietnamese);
    id = checkExist(word, data);
  }else if (type == 2) {
    const data = await list(Foreign_language);
    id = checkExist(word, data);
  }
  let data_translate = await list(Translate);
  let word2 = "";
  let id2 = "";
  data_translate.map( (item) => {
    if (item.id_tv == id && type == 1) {
      id2 = item.id_tt;    
    }else if (item.id_tt == id && type == 2) {  
      id2 = item.id_tv;  
    }
  });

  if (id2 !== "" && type == 1) {
    word2 = await find_word(id2, Foreign_language);  
  }else if (id2 !== "" && type == 2) {
    word2 = await find_word(id2, Vietnamese);
  }

  res.send(word2.word);
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
  let { type, text1, text2 } = req.body;
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
  addList(text1, text2);

  // redirect to another page
  res.redirect('/create');
}

const addList = async (text1, text2) => {
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
      const foreign_language_document = new Foreign_language({ word: text2 });
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
  test,
  translate,
  api_find_word,
}
