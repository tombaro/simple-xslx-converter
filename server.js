// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var xlsx2json = require( "xlsx2json" );
var config = require( './config' );
var mongoose = require( 'mongoose' );
var Person = require( './app/models/person' );

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || config.port;        // set our port

// DB STUFF 
// ===================================================
mongoose.connect( 'mongodb:' + config.db.url );

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:<port>/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// Get all persons
router.route( '/persons' )
	.get( function( req, res ) {
		var newPerson = [];
		var newPersons = [];
		Person.find( {}, function( err, persons ) {
			if ( err ) { throw err };

			persons.forEach( function( person ){
				newPerson.push({
					personnummer: person.personnummer,
					avdelning: person.avdelning,
					created_at: person.created_at
				});
				newPersons.push( newPerson );
			});

			console.log( 'Fetching all persons' );
			res.json( newPerson );
		});
	});

// Insert all persons from file into db
router.route('/persons/save')
	.get(function(req, res) {
		xlsx2json( "assets/Testfil-150313copy.xlsx", 
		{
			dataStartingRow: 2,
			mapping: {
				'personnummer': 'A',
				'avdelning': 'B'
			}
		}).done(function( data ){
			for( var i = 0; i < data.length; i++ ){
				
				var person = new Person();
				person.personnummer = data[i].personnummer;
				person.avdelning = data[i].avdelning;
				
				person.save( function( err ){
					if (err) { throw err; }
				});
			}

			res.json( data );
			
		});
	});

// Count the persons currently in db
router.route( '/persons/count' )
	.get( function( req, res ) {
		var count = [];

		Person.count({}, function( err, count ){
			if ( err ) { throw err };

			console.log( 'We count to ' + count );
			res.json( { count: count } );
		});
	});

// Get person by personnummer
router.route( '/person/:id' )
	.get( function( req, res ) {
		var newPerson = [];
		Person.find( {personnummer: req.params.id }, function( err, persons ) {
			if ( err ) { throw err };

			persons.forEach( function( person ){
				newPerson.push({
					personnummer: person.personnummer,
					avdelning: person.avdelning,
					created_at: person.created_at
				});
			});

			console.log( 'Found this person(s): ' + persons );
			res.json( newPerson );
		});
	});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);