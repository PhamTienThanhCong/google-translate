const express = require('express');
var session = require('express-session');
const hbs = require('hbs');
const path = require('path');
const fs = require('fs');
const config = require('../config/index');
const logger = require('../utils/logger/index');
const app = express();
const logger_request_middleware = require('../middlewares/logger_request');
const bodyparser = require('body-parser');
//Setup middleware
hbs.registerPartials(__dirname + '/views/partials') // partials view
app.set('view engine', 'hbs'); // engine view

app.use(logger_request_middleware);
app.use(bodyparser.urlencoded());
app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, '/public')));

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

app.listen(process.env.PORT || 3000, (err) => {
  if(err) {
    logger.error(err);
    process.exit(1);
  }
  require('../lib/database');  // connect DB

  require('../routes/root')(app);

  logger.info(
    `API is now running on port in ${config.server.environment} mode`
  );

  app._router.stack.forEach(function(r){
    if (r.route && r.route.path && r.route.stack.method){
      console.log(r.route.stack.method + "    " + r.route.path)
    }
  })
});

module.exports = app;
