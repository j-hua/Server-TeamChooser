var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Game = require('../models/game');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JsonStrategy = require('passport-json').Strategy;
var ObjectId = require('mongodb').ObjectID;


//Get HomePage
router.get('/register',function(req,res){
	res.render('register');
});

// Login
router.get('/login',function(req,res){
	res.render('login');
});

//user sign up from android application
router.post('/signup',function(req,res){
	var reqDisplayname = req.body.displayname;
	var reqEmail = req.body.email;
	var reqUsername = req.body.username;
	var reqPasswd = req.body.passwd;

	// Validation
	req.checkBody('displayname', 'display name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('passwd', 'Password is required').notEmpty();

	var errors = req.validationErrors();


	if(errors){

		res.sendStatus(400);
		console.log(errors);

	}else{

		console.log('PASSED');

		var newUser = new User({
			displayname: reqDisplayname,
			email: reqEmail,
			username: reqUsername,
			passwd: reqPasswd
		});


		User.getUserByUsername(reqUsername,function(err,document){
			if(err) throw err;
			if(document){
				console.log("username already exists");
				res.sendStatus(409);
			}else{

				User.createUser(newUser, function(err,newUser){
					if(err) throw err;
					console.log(newUser);
					res.sendStatus(200);
				});
			}
		});

	}
});



router.post('/login', 
	passport.authenticate('json'/*,{successRedirect:'/',failureRedirect:'/login',failureFlash:true}*/),
	function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    console.log(req.user._id);
    console.log("auth successful");
	var allGames = [];
	Game.find({"userId":req.user._id},function(err,doc){
		allGames = doc;
		res.status(200).json({userId: req.user._id, allGames:allGames});
	}); 
  });

/*
passport.use(new LocalStrategy(
  function(username, password, done) {
  	User.getUserByUsername(username,function(err,user){
  		if(err) throw err;
  		if(!user){
  		//	res.sendStatus(404);
  			console.log("Unknown username");
  			return done(null,false,{message: 'Unknown User'});
  		}else{
  			console.log(user);
  		}

  		User.comparePassword(password,user.passwd,function(err,isMatch){
  			if(err) throw err;
  			if(isMatch){
  				console.log("passwd OK!")
  				return done(null,user);
  				res.sendStatus(200);
  			}else{
  				console.log("Invalid passwd");
  				return done(null,false,{message: 'Invalid password'});
  				res.sendStatus(409);
  			}
  		});

  	});

  }));
*/

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
			userId: reqUserId
		//	players: reqPlayers
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


router.get('/:userId/:gameId/allplayers',function(req,res){
	Game.find({"_id":new ObjectId(req.params.gameId)},function(err,document){
		if(err) throw err;
		if(document != ""){
			var allPlayers = document.players;
			console.log(document);
			res.json({allPlayers:allPlayers});
		}else{
			res.status(404).send('Game Not Found');  	
		}
	});
});


router.put('/:userId/:gameId/updategame', function(req, res) {
	console.log("user " + req.params.userId + " requsted to update the game " + req.params.gameId);

	var editGame = req.body;
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
			res.json({game:document});
		}else{
			console.log("document empty");
			console.log(document);
			res.status(404).send('Game Not Found');  	
		}
	});
	
});


router.delete('/:userId/:gameId', function(req, res) {
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

passport.use(new JsonStrategy(
  	{	passwordProp: 'passwd'	},
  	function(username, passwd, done) {
     	User.getUserByUsername(username,function(err,user){
  		if(err) throw err;
  		if(!user){
  		//	res.sendStatus(404);
  			console.log("Unknown username");
  			return done(null,false,{message: 'Unknown User'});
  		}else{
  			console.log(user);
  		}

  		User.comparePassword(passwd,user.passwd,function(err,isMatch){
  			if(err) throw err;
  			if(isMatch){
  				console.log("passwd OK!")
  				return done(null,user)
  			}else{
  				console.log("Invalid passwd");
  				return done(null,false,{message: 'Invalid password'});
 
  			}
  		});

  	});

  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = router;