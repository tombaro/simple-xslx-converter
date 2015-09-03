//person.js

var mongoose = require( 'mongoose' );

var personSchema = new mongoose.Schema({
	personnummer: String,
	avdelning: String,
	created_at: Date
});

personSchema.pre( 'save', function( next ) {
	var currentDate = new Date();

	this.created_at = currentDate;

	next();
})

module.exports = mongoose.model( 'Person', personSchema );