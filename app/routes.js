// routes.js

var Person = require('./models/person');

module.exports = function(app, passport) {

	// test route to make sure everything is working (accessed at GET http://localhost:<port>/)
	app.get('/', passport.authenticate( 'basic', { session: false } ), function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });   
	});

	// Get all persons
	app.get( '/persons', function( req, res ) {
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

			res.json( newPerson );
		});
	});

	// Insert all persons from file into db
	app.get('/persons/save', function(req, res) {
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
	app.get( '/persons/count', function( req, res ) {
		var count = [];

		Person.count({}, function( err, count ){
			if ( err ) { throw err };

			res.json( { count: count } );
		});
	});

	// Get person by personnummer
	app.get( '/person/:id', function( req, res ) {
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

			res.json( newPerson );
		});
	});
}
