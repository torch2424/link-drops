var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var link = mongoose.model( 'link' );

//WE WANT CREATE READ UPDATE DELETE OUR LINKS (CRUD)

/* READ */
//This will search our links for a link the the backend
//.find is an ORM feature that will do this for us
router.get('/', function(req, res, next) {
  link.find(function ( err, links, count ){
      res.json(links);
  });
});

/* CREATE. */
//Post request sending a form to the backend
router.post('/', function(req, res, next) {
    //When we submit a form create a new link
  new link({
      //json object the a link object contains
      user_id    : req.body.user_id,
      content    : req.body.content,
      updated_at : Date.now()
  }).save(function( err, todo, count ){
     //.save will save our new link object in the backend
    res.json({msg: 'successssssss'});
  });
});

module.exports = router;
