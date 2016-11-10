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
module.exports.getGameById = function(id,callback){
	var query = {_id: id};
	User.findOne(query,callback);
}*/

module.exports.getGameById = function(id,callback){
	Game.findById(id,callback);
}

module.exports.getGameByIdandRemove = function(id,callback){
	Game.findByIdAndRemove(id,callback);
}
/*
module.exports.comparePassword = function(candidatePassword,hash,callback){
	bcrypt.compare(candidatePassword,hash,function(err,isMatch){
		if(err) throw err;
		callback(null, isMatch);
	});
}
*/