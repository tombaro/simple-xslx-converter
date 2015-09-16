//user.js

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	basic : {
		username : String,
		password : String,
	}
});

// ---- Methods -----

// Generate a hash
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// Validate password
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.basic.password);
}

module.exports = mongoose.model('User', userSchema);