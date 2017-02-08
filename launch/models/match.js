/**
 * Created by JHUA on 2017-02-07.
 */
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

// User Schema
var MatchSchema = mongoose.Schema({
    teamA:{
        players:
            [{
                playerId: String,
                name:String,
                rating:Number,
            }],
        score:{type:Number}
    },
    teamB:{
        players:
            [{
                playerId: String,
                name:String,
                rating:Number,
            }],
        score:{type:Number}
    },
    gameId:{
        type:String
    },
    userId:{
        type: String
    }
});

//to access from outside of this file
var Match = module.exports = mongoose.model('Match',MatchSchema);

module.exports.createMatch = function(newMatch, callback){
    newMatch.save(callback);
}

