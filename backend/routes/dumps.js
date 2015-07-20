var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var Dump = mongoose.model( 'Dump' );
var Session = mongoose.model( 'Session' );

//Create a new link
router.post('/', function(req, res, next) {
    Session.findOne({ token : req.body.token })
    .select('user_id')
    .exec(function(err, session) {
        if(err){
            res.json({msg: "Couldn't search the database for session!",
                    errorid: "778"});
        } else if(!session){
            res.json({msg: "Session does not exist!",
                    errorid: "43"});
        } else {
            new Dump({
                //json object the a link object contains
                user_id    : session.user_id,
                content    : req.body.content,
                updated_at : Date.now()
            }).save(function( err, dump, count ){
                //.save will save our new link object in the backend
                res.json(dump);
            });
        }
    });
});

//Get all of a user's links
router.get('/', function(req, res, next) {
    Session.findOne({ token : req.query.token })
    .select('user_id')
    .exec(function(err, session) {
        if(err){
            res.json({msg: "Couldn't search the database for session!",
                    errorid: "778"});
        } else if(!session){
            res.json({msg: "Session does not exist!",
                    errorid: "43"});
        } else {
            Dump.find({ user_id: session.user_id }, function ( err, dumps, count ){
                res.json(dumps);
            });
        }
    });
});


//Update a link
router.put('/:linkId', function (req, res) {
    Session.findOne({ token : req.query.token })
    .select('user_id')
    .exec(function(err, session) {
        if(err){
            res.json({msg: "Couldn't search the database for session!",
                    errorid: "778"});
        } else if(!session){
            res.json({msg: "Session does not exist!",
                    errorid: "43"});
        } else {
            Dump.findById( req.params.id, function ( err, dump ){
                if(err){
                    res.json({msg: "Couldn't search the database for dump!",
                            errorid: "779"});
                } else if(!dump){
                    res.json({msg: "Dump does not exist!",
                            errorid: "44"});
                } else {
                    if(session.user_id == dump.user_id){
                        //Simply change the variables of think
                        dump.content = req.body.content;
                        dump.updated_at = Date.now();

                        //Save the modified
                        dump.save(function( err, dump, count ){
                           //.save will save our new link object in the backend
                          res.json(dump);
                        });
                    } else {
                        res.json({msg: "User does not own dump!",
                                errorid: "999"});
                    }
                }
            });
        }
    });
});

//DELETE
//Using the ORM (object relational mapping) which is mongoose
//it will find a link by it's mongoose id, and remove it from the backend
router.delete('/', function (req, res) {
    //This will search the links objects, once it is Found
    //it will pass the link object to link remove
    Dump.findById( req.body.id, function ( err, dump ){
    if(err)
    {
        //if there is an error
        res.json({msg: 'ERROR LINK COULD NOT BE FOUND...NIGGA'});
    }
    else
    {
        //call remove on the link object that was passed
        //then pass that to the remove so we can include it in the message
        dump.remove( function ( err, dump ){
       //backends are not user friendly, just output the deleted link
          res.json(dump);
        });
    }
   });
});


module.exports = router;
