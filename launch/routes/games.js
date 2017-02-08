/**
 * Created by JHUA on 2017-02-07.
 */

var express = require('express');
var Game = require('../models/game');
var ObjectId = require('mongodb').ObjectID;
var router = express.Router();

router.post('/:userId/creategame', function(req, res) {
    console.log("require to create a game");

    var reqGameName = req.body.gameName;
//	var reqHasBODCount = req.body.hasBODCount;
//	var reqHasBODRatings = req.body.hasBODRatings;
//	var reqHasSuperOptimizer = req.body.hasSuperOptimizer;
    var reqTeamA = req.body.teamA;
    var reqTeamB = req.body.teamB;
    var reqUserId = req.params.userId;
//	var reqPlayers = req.body.players;
    //add game to the database with these attributes
    req.checkBody('gameName', 'game name is required').notEmpty();
//	req.checkBody('hasBODCount', 'hasBODCount is required').notEmpty();
//	req.checkBody('hasBODRatings', 'hasBODRatings is required').notEmpty();
//	req.checkBody('hasSuperOptimizer', 'hasSuperOptimizer is not valid').notEmpty();
    req.checkBody('teamA', 'teamA is required').notEmpty();
    req.checkBody('teamB', 'teamB is required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        res.sendStatus(400);
        console.log("400!");
        console.log(errors);
    }else{

        console.log('Game Request PASSED');

        var newGame = new Game({
            gameName: reqGameName,
            //	hasBODCount: reqHasBODCount,
            //	hasBODRatings: reqHasBODRatings,
            //	hasSuperOptimizer: reqHasSuperOptimizer,
            teamA: reqTeamA,
            teamB: reqTeamB,
            userId: reqUserId,
            players: []
        });
        //write into database
        Game.createGame(newGame, function(err,newGame){
            if(err) throw err;
            console.log(newGame);
            res.json({id: newGame._id});
        });
    }

});

router.post('/:userId/:gameId/createplayer', function(req, res) {
    console.log('user ' + req.params.userId +" requsted to create a player in game " + req.params.gameId);
    var newPlayer = req.body;
    newPlayer.gameId = req.params.gameId;

    Game.find({"_id":new ObjectId(req.params.gameId)},function(err,document){
        if(err) throw err;
        if(document != ""){
            var playerId = Game.createPlayer(newPlayer, function(err,results){
                if(err) throw err;
                console.log(results);
                res.json({id:playerId});
            });
        }else{
            res.status(404).send('Game Not Found');
        }
    });
});

router.get('/:userId/allgames',function(req,res){
    var allGames = [];
    Game.find({"userId":req.params.userId},function(err,doc){
        doc.forEach(function(item){
            //mongoose quert results are not array of JS objects
            //need to convert to JS object
            var game = item.toObject();
            game.id = game._id;
            delete game._id;
            allGames.push(game);
        });
        console.log(allGames);

        res.status(200).json({allGames:allGames});
    });
});

router.get('/:userId/:gameId/allplayers',function(req,res){
    Game.find({"_id":new ObjectId(req.params.gameId)},function(err,document){
        if(err) throw err;
        if(document != ""){
            var allPlayers = document[0].toObject().players;
            res.json({allPlayers:allPlayers});
        }else{
            res.status(404).send('Game Not Found');
        }
    });
});

router.put('/:userId/:gameId/updategame', function(req, res) {
    console.log("user " + req.params.userId + " requsted to update the game " + req.params.gameId);

    var editGame = req.body; //req.body is JS object!
    editGame._id = req.params.gameId;
    editGame.userId = req.params.userId;
    delete editGame['id'];

    //need to check if user exits
    //game exits and belong to the user
    Game.find({"_id":new ObjectId(req.params.gameId)},function(err,document){
        if(err) throw err;
        if(document != ""){
            Game.updateGame(editGame, function(err,results){
                if(err) throw err;
                console.log(results);
                res.status(200).send('Game updated!');
            });
        }else{
            console.log(document);
            res.status(404).send('Game Not Found');
        }
    });

});


router.get('/:userId/:gameId/getgame', function(req, res) {
    console.log("user " + req.params.userId + " requsted the game " + req.params.gameId);

    //need to check if user exits
    //game exits and belong to the user
    Game.find({"_id":new ObjectId(req.params.gameId)},function(err,document){
        if(err) throw err;
        if(document != ""){
            console.log("the following game has been found and returned to user");
            console.log(document);
            document[0].id = document._id;
            //editGame.userId = req.params.userId;
            delete document[0]._id;
            res.json({game:document[0]});
        }else{
            console.log("document empty");
            console.log(document);
            res.status(404).send('Game Not Found');
        }
    });

});


router.delete('/:userId/:gameId/deletegame', function(req, res) {
    var found = false;
    //database query to find game and delete it
    Game.find({"_id":new ObjectId(req.params.gameId)},function(err,document){
        if(err) throw err;
        if(document){
            console.log("The following game has been deleted");
            console.log(document);
            Game.getGameByIdandRemove(req.params.gameId,function(err,document) {
                if(err) throw err;
            });
            res.status(200).send('Game Deleted!');
        }else{
            res.status(404).send('No Game found!');
        }
    });
});

module.exports = router;
