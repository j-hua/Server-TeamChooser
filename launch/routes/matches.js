var express = require('express');
var router = express.Router();
var Match = require('../models/match');
var ml = require('../ml/ml.js');
var Game = require('../models/game');
var ObjectId = require('mongodb').ObjectID;


router.post('/:userId/:gameId/match', function(req, res) {

    //error checking

    var newMatch = new Match({
        teamA:req.body.teamA,
        teamB:req.body.teamB,
        userId: req.params.userId,
        gameId: req.params.gameId
    });

    var gameId = req.params.gameId;
    Match.createMatch(newMatch,function (req,res) {
        console.log("new match created")

        //calculate ratings for each players
        Match.find({"gameId":gameId},function(err,document){
          if(err) throw err;
          else{
              var allMatches = [];
              document.forEach(function (item) {
                  allMatches.push(item.toObject());
              });

              Game.find({"_id":new ObjectId(gameId)},function(err,document){
                  if(err) throw err;
                  if(document != ""){
                      var allPlayers = document[0].toObject().players;
                      ml.invokeML(allPlayers,allMatches);
                  }
              });

          }
        });
    });

});

module.exports = router;