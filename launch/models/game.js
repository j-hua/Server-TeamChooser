var mongoose = require('mongoose');

// User Schema
var UserSchema = mongoose.Schema({
	gameName:{
		type: String,
	},
	hasBODCount:{
		type: Boolean,
		default:false,
	},
	hasBODRatings:{
		type: Boolean,
		default: false,
	},
	
	hasSuperOptimizer:{
		type: Boolean,
		default: false,

	},
	teamA:{
<<<<<<< Updated upstream:launch/models/game.js
		name: {type: String, trim: true},
		//type: String,
	},
	teamB:{
		name: {type: String, trim: true},
		//type: String,
=======
		name: {type: String, trim: true}
	},
	teamB:{
		name: {type: String, trim: true} 
>>>>>>> Stashed changes:loginapp/models/game.js
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
module.exports.getAllGamesByUserID = function(id,callback){
	var query = {teamA.id:id,teamB.id:id};
	Game.find(query,callback);
}*/

/*
module.exports.comparePassword = function(candidatePassword,hash,callback){
	bcrypt.compare(candidatePassword,hash,function(err,isMatch){
		if(err) throw err;
		callback(null, isMatch);
	});
}
*/