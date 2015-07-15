var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var link = mongoose.model( 'link' );

//WE WANT CREATE READ UPDATE DELETE OUR LINKS (CRUD)

/*
    we need to check for errors by simply Using
    if(err)
    {
    //handle shizz
}

*/

/* CREATE. */
//Post request sending a form to the backend
router.post('/', function(req, res, next) {
    //When we submit a form create a new link
  new link({
      //json object the a link object contains
      user_id    : req.body.user_id,
      content    : req.body.content,
      updated_at : Date.now()
  }).save(function( err, link, count ){
     //.save will save our new link object in the backend
    res.json({msg: 'successssssss'});
  });
});

/* READ */
//This will search our links for a link the the backend
//.find is an ORM feature that will do this for us
router.get('/', function(req, res, next) {
  link.find(function ( err, links, count ){
      res.json(links);
  });
});


//DELETE
//Using the ORM (object relational mapping) which is mongoose
//it will find a link by it's mongoose id, and remove it from the backend
router.delete('/', function (req, res) {
    //This will search the links objects, once it is Found
    //it will pass the link object to link remove
    link.findById( req.body.id, function ( err, link ){
    if(err)
    {
        //if there is an error
        res.json({msg: 'ERROR LINK COULD NOT BE FOUND...NIGGA'});
    }
    else
    {
        //call remove on the link object that was passed
        //then pass that to the remove so we can include it in the message
        link.remove( function ( err, link ){
       //backends are not user friendly, just output the deleted link
          res.json(link);
        });
    }
   });
});


module.exports = router;
