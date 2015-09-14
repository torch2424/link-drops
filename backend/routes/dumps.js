var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Dump = mongoose.model('Dump');
var Session = mongoose.model('Session');

//Create a new link
router.post('/', function(req, res, next) {
  Session.findOne({
      token: req.body.token
    })
    .select('user_id')
    .exec(function(err, session) {
      if (err) {
        res.status(500).json({
          msg: "Couldn't search the database for session!"
        });
      } else if (!session) {
        res.status(401).json({
          msg: "Session is not valid!"
        });
      } else {
        new Dump({
          //json object the a link object contains
          user_id: session.user_id,
          content: req.body.content,
          updated_at: Date.now()
        }).save(function(err, dump, count) {
          //.save will save our new link object in the backend
          if (err) {
            res.status(500).json({
              msg: "Error saving the dump!"
            });
          } else {
            res.status(201).json(dump);
          }
        });
      }
    });
});

//Get all of a user's links
router.get('/', function(req, res, next) {
  Session.findOne({
      token: req.query.token
    })
    .select('user_id')
    .exec(function(err, session) {
      if (err) {
        res.status(500).json({
          msg: "Couldn't search the database for session!"
        });
      } else if (!session) {
        res.status(401).json({
          msg: "Session is not valid!"
        });
      } else {
        Dump.find({
          user_id: session.user_id
        }, function(err, dumps, count) {
          res.status(200).json(dumps);
        });
      }
    });
});


//Update a link
router.put('/:id', function(req, res) {
  Session.findOne({
      token: req.query.token
    })
    .select('user_id')
    .exec(function(err, session) {
      if (err) {
        res.status(500).json({
          msg: "Couldn't search the database for session!"
        });
      } else if (!session) {
        res.status(401).json({
          msg: "Session is not valid!"
        });
      } else {
        Dump.findOne({
          _id: req.params.id,
          user_id: session.user_id
        }, function(err, dump) {
          if (err) {
            res.status(500).json({
              msg: "Couldn't search the database for dump!"
            });
          } else if (!dump) {
            res.status(404).json({
              msg: "Dump does not exist!"
            });
          } else {
            //Simply change the variables of think
            dump.content = req.body.content;
            dump.updated_at = Date.now();

            //Save the modified
            dump.save(function(err, dump, count) {
              //.save will save our new link object in the backend
              res.status(200).json(dump);
            });
          }
        });
      }
    });
});

//DELETE
//Using the ORM (object relational mapping) which is mongoose
//it will find a link by it's mongoose id, and remove it from the backend
router.delete('/:id', function(req, res) {
  Session.findOne({
      token: req.query.token
    })
    .select('user_id')
    .exec(function(err, session) {
      if (err) {
        res.status(500).json({
          msg: "Couldn't search the database for session!"
        });
      } else if (!session) {
        res.status(401).json({
          msg: "Session is not valid!"
        });
      } else {
        Dump.findOne({
          _id: req.params.id,
          user_id: session.user_id
        }, function(err, dump) {
          if (err) {
            res.status(500).json({
              msg: "Couldn't search the database for dump!"
            });
          } else if (!dump) {
            res.status(404).json({
              msg: "Dump does not exist!"
            });
          } else {
            dump.remove(function(err, dump) {
              res.status(200).json(dump);
            });
          }
        });

      }
    });
});


module.exports = router;
