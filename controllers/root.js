const Translate = require('../models/translate');
const Language  = require('../models/language');

const translate = async (req, res) => {
  let languages = await Language.find({});
  res.render('find_word', { languages });
}

// write function api_find_word(req, res) 
const api_find_word = async (req, res) => {
  let { type, word, language } = req.query;
  let list_anouce = [];
  if (type == 1){
    if (language == 0){
      list_anouce = await Translate.find({korea: word});
    }else{
      list_anouce = await Translate.find({korea: word, language: language});
    }
  }else{
    word = word.toLowerCase();
    list_anouce = await Translate.find({foreign_languages: word, language: language});
    list_anouce.map((item) => {
      item.foreign_languages = item.korea;
    });
  }

  res.send(list_anouce);
}

// add new value to Korean and Foreign_language 

const delete_list = async (req, res) => {
  
}

const vote = async (req, res) => {
  // get id from url params
  let { id } = req.params;
  let getData = await Translate.findById(id);
  if (getData){
    res.render('vote', { getData });
  }else{
    res.redirect('/');
  }
}

const addVote = async (req, res) => {
  let { id, vote, description } = req.body;
  
  let getData = await Translate.findById(id);
  if (getData){
    if (vote == 'like'){
      getData.vote_up += 1;
    }else{
      getData.vote_down += 1;
    }
    const voteToTal ={
      vote: vote,
      description: description,
      time: `${new Date()}`
    }
    getData.votes = [voteToTal, ...getData.votes];
  }

  try {
    await Translate.findByIdAndUpdate(id,{
      vote_up: getData.vote_up,
      vote_down: getData.vote_down,
      votes: getData.votes
    })
    res.redirect(`/thankiu/${id}`);
  } catch (error) {
    res.redirect(`/thankiu/${id}`);
  }
  
}
const thankiu = (req, res) => {
  // get id from url params
  let { id } = req.params;
  return res.render('thankiu', {id});
}
module.exports = {
  thankiu,
  addVote,
  translate,
  delete_list,
  api_find_word,
  vote
}
