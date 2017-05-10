var express = require('express');
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var flash    = require('connect-flash');
var app = express();

var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

require('./config/passport')(passport);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



require('./app/routes.js')(app, passport);

app.listen(port);
