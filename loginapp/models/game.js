var mongoose = require('mongoose');

// User Schema
var UserSchema = mongoose.Schema({
	gameName:{
		type: String,
	},
	hasBODCount:{
		type: String,
	},
	hasBODRatings:{
		type: String,
	},
	hasSuperOptimizer:{
		type: String,
	},
	teamA:{
		type: String,
	},
	teamB:{
		type: String,
	}
});

//to access from outside of this file
var Game = module.exports = mongoose.model('Game',UserSchema);

module.exports.createGame = function(newGame, callback){
	newGame.save(callback);
}

/*
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
*/