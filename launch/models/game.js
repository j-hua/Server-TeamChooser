var mongoose = require('mongoose');

// User Schema
var GameSchema = mongoose.Schema({
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
		name: {type: String, trim: true},
	},
	teamB:{
		name: {type: String, trim: true},
	},
	players:
		[{isSelected:Boolean, 
			name:String, 
			preassign:Boolean, 
			rating:Number, 
			team:String,
			position:String}]
});

//to access from outside of this file
var Game = module.exports = mongoose.model('Game',GameSchema);

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