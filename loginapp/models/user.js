var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//mongoose.connect('mongodv://localhost/loginapp');

//var db = mongoose.connection;

// User Schema
var UserSchema = mongoose.Schema({
	username:{
		type: String,
		index:true
	},
	passwd:{
		type: String,
	},
	email:{
		type: String
	},
	displayname:{
		type: String
	}
});

//to access from outside of this file
var User = module.exports = mongoose.model('User',UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.passwd, salt, function(err, hash) {
	        newUser.passwd = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username,callback){
	var query = {username: username};
	User.findOne(query,callback);
}

module.exports.getUserById = function(id,callback){
	User.findById(id,callback);
}

module.exports.comparePassword = function(candidatePassword,hash,callback){
	bcrypt.compare(candidatePassword,hash,function(err,isMatch){
		if(err) throw err;
		callback(null, isMatch);
	});
}