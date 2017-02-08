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
    Match.createMatch(newMatch,function (err,newMatch) {
        console.log("new match created")
        res.status(200).send('Ok');
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
                      var ratings = ml.invokeML(allPlayers,allMatches);
                        //update player ratings
                      ratings.forEach(function (player) {
                          console.log(player.playerId);
                          console.log(player.rating);
                         /* Game.updatePlayerRating(gameId,player.playerId,player.rating,function(){
//                              console.log("rating updated");

                          });*/
                      });
                /*      Game.update({_id:gameId,players.playerId:)}, {$set: {$set:playerseditGame.gameName,
                              teamA:editGame.teamA,teamB:editGame.teamB,userId:editGame.userId}},callback);*/
                  }
              });

          }
        });
    });

});

module.exports = router;