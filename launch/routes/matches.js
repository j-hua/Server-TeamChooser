var express = require('express');
var router = express.Router();
var Match = require('../models/match');


router.post('/recovery', function(req, res){

	var obj = req.body;
//	var obj = JSON.parse(array);
	
	req.checkBody('email', 'email cannot be empty').notEmpty();
	console.log(obj);

	res.sendStatus(200);

});

module.exports = router;