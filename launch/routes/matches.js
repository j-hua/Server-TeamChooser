var express = require('express');
var router = express.Router();
var Match = require('../models/match');


router.post('/:userId/:gameId/match', function(req, res) {

    //error checking

    var newMatch = new Match({
        teamA:req.body.teamA,
        teamB:req.body.teamB,
        userId: req.params.userId,
        gameId: req.params.gameId
    });

    Match.createMatch(newMatch,function (res,req) {
        console.log("new match created");

        //calculate ratings for each players
        Match.find({"gameId":gameId},function(err,document){
          if(err) throw err;
          else{
              var allmatches = [];
              document.forEach(function (item) {
                  allmatches.push(item.toObject());
              });
          }
        });
    });

});

module.exports = router;