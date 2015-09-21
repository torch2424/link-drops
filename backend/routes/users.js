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
          msg: "Wrong email!"
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
  var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)\b/;
  if (!emailRegex.test(req.body.username)) {
    res.status(412).json({
      msg: "Email is not valid!"
    });
  } else {
    //Check if a user with that username already exists
    User.findOne({
        username: req.body.username.toLowerCase()
      })
      .select('_id')
      .exec(function(err, user) {
        if (user) {
          res.status(406).json({
            msg: "Email taken!"
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
  }
});

/* Update user */
router.put('/', function(req, res, next) {
  var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)\b/;
  if (req.body.username && !emailRegex.test(req.body.username)) {
    res.status(412).json({
      msg: "Email is not valid!"
    });
  } else {
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
          var updatedUser = {};

          if (req.body.username && typeof req.body.username === 'string') updatedUser.username = req.body.username;
          if (req.body.password && typeof req.body.password === 'string') {
            //Create a random salt
            var salt = crypto.randomBytes(128).toString('base64');
            //Create a unique hash from the provided password and salt
            var hash = crypto.pbkdf2Sync(req.body.password, salt, 10000, 512);
            updatedUser.password = hash;
            updatedUser.salt = salt;
          }

          var setUser = {
            $set: updatedUser
          }

          User.update({
              _id: session.user_id
            }, setUser)
            .exec(function(err, user) {
              if (err) {
                res.status(500).json({
                  msg: "Could not update user"
                });
              } else {
                res.status(200).json(user);
              }
            });
        }
      });
  }
});

/* Check if a session token is valid */
router.get('/session', function(req, res, next) {
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
        //Then the user exists, and the session token is valid!
        res.status(200).json({
          token: req.query.token
        });
      }
    });
});

module.exports = router;
