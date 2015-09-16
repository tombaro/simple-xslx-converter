// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require( './config' );
var mongoose = require( 'mongoose' );
var passport = require( 'passport' );

var port = process.env.PORT || config.port;        // set our port

// DB STUFF 
// ===================================================
mongoose.connect( 'mongodb:' + config.db.url );

// Configure Passport
require('./app/passport')(passport); 


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// LOG 
app.use(morgan('dev'));

// Passport stuff
app.use(passport.initialize());	


// Routes
require('./app/routes.js')(app, passport, config.filepath);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);