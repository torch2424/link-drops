var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Dump = mongoose.model('Dump');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(404).send("Not found");
});

module.exports = router;
