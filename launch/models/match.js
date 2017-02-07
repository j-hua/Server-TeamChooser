/**
 * Created by JHUA on 2017-02-07.
 */
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

// User Schema
var MatchSchema = mongoose.Schema({
    players:
        [{
            playerId: String,
            name:String,
            rating:Number,
            score:Number
            //team?
        }],
    gameId:{
        type:String
    }
});

//to access from outside of this file
var Match = module.exports = mongoose.model('Match',GameSchema);