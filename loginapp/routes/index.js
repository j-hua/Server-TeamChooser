var express = require('express');
var router = express.Router();

//Get HomePage
router.get('/',function(req,res){
	res.render('index');
});

router.get('/test',function(req,res){
	res.send("test page");
});

router.get('/test/:testparam',function(req,res){
	res.send(req.params.testparam + " test page");
});


router.post('/', function(req, res){
	var obj = req.body;
//	var obj = JSON.parse(array);
	console.log(obj);
	console.log(obj.array);
	req.checkBody('array', 'array cannot be empty').notEmpty().isInt();

	var sum = 0;
	for (var i = 0; i < obj.array.length; i ++){
		sum += obj.array[i];
	}
	console.log("average: " + sum/obj.array.length);
    
    // Validation
	

//	req.checkBody('email', 'Email is required').notEmpty();
//	req.checkBody('email', 'Email is not valid').isEmail();
//	req.checkBody('username', 'Username is required').notEmpty();
//	req.checkBody('password', 'Password is required').notEmpty();
//	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

//	var errors = req.validationErrors();
	
});

module.exports = router;