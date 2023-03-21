const express = require('express');
var session = require('express-session');
const hbs = require('hbs');
const path = require('path');
const config = require('../config/index');
const app = express();
const bodyparser = require('body-parser');
//Setup middleware
hbs.registerPartials(__dirname + '/views/partials') // partials view
app.set('view engine', 'hbs'); // engine view

app.use(bodyparser.urlencoded());
app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, '../public')));

app.use(session({
  secret: 'abcdefg',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 600000 }
}));

hbs.registerHelper('getCurrentYear', () => { //ViewHelper
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => { //ViewHelper
  return text.toUpperCase();
});

// run server

// app.listen(process.env.PORT || 3000)
// app.listen(config.server.port, (err) 

app.listen(config.server.port, (err) => {
  if(err) {
    process.exit(1);
  }
  require('../lib/database');  // connect DB

  require('../routes/root')(app);


  app._router.stack.forEach(function(r){
    if (r.route && r.route.path && r.route.stack.method){
      console.log(r.route.stack.method + "    " + r.route.path)
    }
  })
  console.log("running app port 3000")
});

module.exports = app;
