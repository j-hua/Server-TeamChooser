var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Game = require('../models/game');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JsonStrategy = require('passport-json').Strategy;

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
		doc.forEach(function(item){
			var game = item.toObject();
			game.id = game._id;
			delete game._id;
			allGames.push(game);
		});
		res.status(200).json({userId: req.user._id, allGames:allGames});
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