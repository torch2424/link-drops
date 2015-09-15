var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Dump = mongoose.model('Dump');
var Label = mongoose.model('Label');
var Session = mongoose.model('Session');

//Add a label to a dump
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
        Dump.findOneAndUpdate({
          user_id: session.user_id,
          content: req.body.link
        }, {
          $setOnInsert: {
            user_id: session.user_id,
            content: req.body.link,
            updated_at: Date.now()
          }
        }, {
          new: true,
          upsert: true
        }, function(err, dump, count) {
          if (err) {
            res.status(500).json({
              msg: "Couldn't search/update the dump!"
            });
          } else if (!dump) {
            res.status(500).json({
              msg: "Dump does not exist! CRUCIAL ERR. System should not reach this message."
            });
          } else {
            Label.findOneAndUpdate({
                user_id: session.user_id,
                title: req.body.title
              }, {
                $addToSet: {
                  "dumps": dump._id
                }
              }, {
                safe: true,
                upsert: true,
                new: true
              },
              function(err, label) {
                if (err) {
                  res.status(500).json({
                    msg: "Couldn't add to the database!"
                  });
                } else {
                  res.status(201).json(label);
                }
              });
          }
        });
      }
    });
});

//Get all of a user's labels
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
        Label.find({
            user_id: session.user_id
          })
          .populate('dumps')
          .exec(function(err, labels, count) {
            res.status(200).json(labels);
          });
      }
    });
});

//Delete a label
router.delete('/:labelId', function(req, res) {
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
        Label.findOneAndUpdate({
            _id: req.params.labelId,
            user_id: session.user_id
          }, {
              $pull: { 'dumps': req.query.dumpId }
          }, {
              new: true
          }, function(err, label) {
            if (err) {
              res.status(500).json({
                msg: "Couldn't search the database for label!"
              });
            } else if (!label) {
              res.status(404).json({
                msg: "Label does not exist!"
              });
            } else {
                if(label.dumps.length == 0){
                    label.remove(function(data){
                        res.status(200).json(data);
                    }, function(err){
                        res.status(500).json({
                          msg: "Couldn't remove empty label from database!"
                        });
                    });
                } else {
                    res.status(200).json(label);
                }
            }
          });

      }
    });
});

module.exports = router;
