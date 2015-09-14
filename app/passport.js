//passport.js

// ========================================
// BASIC AUTHENTICATION
// ========================================

var BasicStrategy = require('passport-http').BasicStrategy;

var User = require('./models/user');

module.exports = function(passport) {
	passport.use(new BasicStrategy(
		function(username, password, done) {
			process.nextTick(function() {

				User.findOne({ username: username }, function(err, user) {
					if (err) {
						return done(err);
					};

					if (!user) {
						return done(null, false);
					}

					if (!user.validPassword(password)) {
						return done(null, false);
					}

					// It is ok
					return done(null, user);
				});
			}
		)}
	));
};
