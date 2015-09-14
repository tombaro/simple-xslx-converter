//user.js

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	basic : {
		username : String,
		password : String
	}
});

module.exports = mongoose.model('User', userSchema);