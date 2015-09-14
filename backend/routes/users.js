var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Session = mongoose.model('Session');

/* Log in user */
router.post('/login', function(req, res, next) {
  //Find a user with the username requested. Select salt and password
  User.findOne({
      username: req.body.username.toLowerCase()
    })
    .select('password salt')
    .exec(function(err, user) {
      if (err) {
        res.status(500).json({
          msg: "Couldn't search the database for user!"
        });
      } else if (!user) {
        res.status(401).json({
          msg: "Username does not exist!"
        });
      } else {
        //Hash the requested password and salt
        var hash = crypto.pbkdf2Sync(req.body.password, user.salt, 10000, 512);
        //Compare to stored hash
        if (hash == user.password) {
          //Create a random token
          var token = crypto.randomBytes(48).toString('hex');
          //New session!
          new Session({
            user_id: user._id,
            token: token
          }).save(function(err) {
            if (err) {
              console.log("Error saving token to DB!");
              res.status(500).json({
                msg: "Error saving token to DB!"
              });
            } else {
              //All good, give the user their token
              res.status(200).json({
                token: token
              });
            }
          });
        } else {
          res.status(401).json({
            msg: "Password is incorrect!"
          });
        }
      }
    });
});

/* Join as a user */
router.post('/join', function(req, res, next) {
  //Check if a user with that username already exists
  User.findOne({
      username: req.body.username.toLowerCase()
    })
    .select('_id')
    .exec(function(err, user) {
      if (user) {
        res.status(406).json({
          msg: "Username already exists!"
        });
      } else {
        //Create a random salt
        var salt = crypto.randomBytes(128).toString('base64');
        //Create a unique hash from the provided password and salt
        var hash = crypto.pbkdf2Sync(req.body.password, salt, 10000, 512);
        //Create a new user with the assembled information
        var newUser = new User({
          username: req.body.username.toLowerCase(),
          password: hash,
          salt: salt
        }).save(function(err, newUser) {
          if (err) {
            console.log("Error saving user to DB!");
            res.status(500).json({
              msg: "Error saving user to DB!"
            });
          } else {
            //Create a random token
            var token = crypto.randomBytes(48).toString('hex');
            //New session!
            new Session({
              user_id: newUser._id,
              token: token
            }).save(function(err) {
              if (err) {
                res.status(500).json({
                  msg: "Error saving token to DB!"
                });
              } else {
                //All good, give the user their token
                res.status(201).json({
                  token: token
                });
              }
            });
          }
        });
      }
    });
});


/* Check if a session token is valid */
router.get('/session', function(req, res, next) {
  Session.findOne({
      token: req.query.token
    })
    .select('user_id')
    .exec(function(err, session) {
      if (err) {
        res.json({
          msg: "Couldn't search the database for session!",
          errorid: "778"
        });
      } else if (!session) {
        res.json({
          msg: "Session does not exist!",
          errorid: "43"
        });
      } else {
        //Then the user exists, and the session token is valid!
        res.json({
          valid: "true"
        });
      }
    });
});

module.exports = router;
