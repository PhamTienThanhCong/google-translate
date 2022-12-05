const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const hbs = require('hbs');
const path = require('path');
const fs = require('fs');
const config = require('./config/index');
const logger = require('./utils/logger/index');
const app = express();
const logger_request_middleware = require('./middlewares/logger_request');
const bodyparser = require('body-parser');
//Setup middleware
hbs.registerPartials(__dirname + '/views/partials') // partials view
app.set('view engine', 'hbs'); // engine view

app.use(logger_request_middleware);
app.use(bodyparser.urlencoded());
app.use(bodyparser.json());

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

app.use(express.static(__dirname + '/public')); // public


hbs.registerHelper('getCurrentYear', () => { //ViewHelper
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => { //ViewHelper
  return text.toUpperCase();
});

hbs.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});
// run server
app.listen(config.server.port, (err) => {
  if(err) {
    logger.error(err);
    process.exit(1);
  }
  require('./lib/database');  // connect DB

  require('./routes/root')(app);

  logger.info(
    `API is now running on port ${config.server.port} in ${config.server.environment} mode`
  );

  app._router.stack.forEach(function(r){
    if (r.route && r.route.path && r.route.stack.method){
      console.log(r.route.stack.method + "    " + r.route.path)
    }
  })
});

module.exports = app;
