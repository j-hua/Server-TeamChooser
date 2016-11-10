var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Game = require('../models/game');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JsonStrategy = require('passport-json').Strategy;

//Get HomePage
router.get('/register',function(req,res){
	res.render('register');
});

// Login
router.get('/login',function(req,res){
	res.render('login');
});

// Register User
/*
router.post('/register',function(req,res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{errors: errors});
	}else{
		console.log('PASSED');
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err,newUser){
			if(err) throw err;
			console.log(newUser);
		});

		req.flash('success_msg', 'You are registered and can now log in');

		res.redirect('/users/login');
	}

});
*/

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
    console.log("auth successful");
    res.sendStatus(200);
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
	console.log("HELLO");

	var reqGameName = req.body.gameName;
	var reqHasBODCount = req.body.hasBODCount;
	var reqHasBODRatings = req.body.hasBODRatings;
	var reqHasSuperOptimizer = req.body.hasSuperOptimizer;
	var reqTeamA = req.body.teamA;
	var reqTeamB = req.body.teamB;
    //add game to the database with these attributes
  	req.checkBody('gameName', 'game name is required').notEmpty();
	req.checkBody('hasBODCount', 'hasBODCount is required').notEmpty();
	req.checkBody('hasBODRatings', 'hasBODRatings is required').notEmpty();
	req.checkBody('hasSuperOptimizer', 'hasSuperOptimizer is not valid').notEmpty();
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
			hasBODCount: reqHasBODCount,
			hasBODRatings: reqHasBODRatings,
			hasSuperOptimizer: reqHasSuperOptimizer,
			teamA: reqTeamA,
			teamB: reqTeamB
		});
		//write into database 
		Game.createGame(newGame, function(err,newGame){
					if(err) throw err;
					console.log(newGame);		
				//	res.sendStatus(200);
					res.json({id: newGame._id});   
		});
	}
  
});


router.delete('/:userId/:gameId', function(req, res) {
    var found = false;
    //database query to find game and delete it
	Game.getGameById(req.params.gameId,function(err,document){
	if(err) throw err;
	if(document){
		console.log("Game exists, deleting it");
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