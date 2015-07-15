var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var link = mongoose.model( 'link' );

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
