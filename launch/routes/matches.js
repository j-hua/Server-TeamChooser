var express = require('express');
var router = express.Router();
var Match = require('../models/match');


router.post('/:userId/:gameId/match', function(req, res) {
    console.log(req)
    res.status(200).send('Ok');
});

module.exports = router;