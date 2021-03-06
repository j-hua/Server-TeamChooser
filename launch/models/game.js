/**
 * Created by JHUA on 2016-11-12.
 */
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

// Game Schema
var GameSchema = mongoose.Schema({
	gameName:{
		type: String,
	},
	teamA:{
		name: {type: String, trim: true},
	},
	teamB:{
		name: {type: String, trim: true},
	},
	userId:{
		type: String,
	},
	players:
		[{
			playerId: String,
			name:String, 
			rating:Number, 
		}]
});

//to access from outside of this file
var Game = module.exports = mongoose.model('Game',GameSchema);

module.exports.createGame = function(newGame, callback){
	newGame.save(callback);
}

module.exports.updateGame = function(editGame, callback){
	//console.log(editGame);
	Game.update({_id:new ObjectId(editGame._id)}, {$set: {gameName:editGame.gameName,
		teamA:editGame.teamA,teamB:editGame.teamB,userId:editGame.userId}},callback);
}

module.exports.updatePlayerRating = function (gameId,playerId,playerRating, callback) {
    Game.update({_id:new ObjectId(gameId),"players.playerId":playerId},{$set:{"players.$.rating":playerRating}},callback);
}

module.exports.createPlayer = function(playerBuff, callback){
	var pId = new ObjectId();
	Game.update({_id:new ObjectId(playerBuff.gameId)}, {$push: {players:{
		name:playerBuff.name,
		rating:playerBuff.rating,
		playerId:pId
	}}},callback);
	return pId;
}

/*
module.exports.getGameById = function(id,callback){
	var query = {_id: id};
	User.findOne(query,callback);
}*/

module.exports.getGameById = function(id,callback){
	Game.find({"_id":new ObjectId(id)},callback);
}

module.exports.getGameByIdandRemove = function(id,callback){
	Game.findByIdAndRemove(id,callback);
}


module.exports.getAllPlaters = function(gameId){
    Game.find({"_id":new ObjectId(gameId)},function(err,document){
        if(err) throw err;
        else{
            return document[0].toObject().players;
        }
    });
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