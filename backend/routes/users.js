var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Session = mongoose.model('Session');

/* Log in user */
router.post('/login', function(req, res, next) {

    User.findOne({ username : req.body.username })
    .select('password salt')
    .exec(function(err, user) {
        if(err){
            res.json({msg: "Couldn't search the database for user!",
                    errorid: "777"});
        } else if(!user){
            res.json({msg: "Username does not exist!",
                    errorid: "23"});
        } else {
            var hash = crypto.pbkdf2Sync(req.body.password, user.salt, 10000, 512);
            if(hash == user.password){
                var token = crypto.randomBytes(48).toString('hex');
                new Session(
                    {
                        user_id: user._id,
                        token: token
                    }).save(function(err){
                        if(err){
                            console.log("Error saving token to DB!");
                            res.json({msg: "Error saving token to DB!",
                                    errorid: "667"});
                        } else {
                            res.json({token: token});
                        }
                    });
            } else {
                res.json({msg: "Password is incorrect!",
                        errorid: "32"});
            }
        }
    });
});

/* Join as a user */
router.post('/join', function(req, res, next) {

    User.findOne({ username : req.body.username })
    .select('_id')
    .exec(function(err, user) {
        if(user){
            res.json({msg: "Username already exists!",
                    errorid: "22"});
        } else {
            var salt = crypto.randomBytes(128).toString('base64');
            var hash = crypto.pbkdf2Sync(req.body.password, salt, 10000, 512);
            var user = new User({
                username: req.body.username,
                password: hash,
                salt: salt
            }).save(function(err){
                if(err){
                    console.log("Error saving user to DB!");
                    res.json({msg: "Error saving user to DB!",
                            errorid: "666"});
                } else {
                    var token = crypto.randomBytes(48).toString('hex');
                    new Session(
                        {
                            user_id: user._id,
                            token: token
                        }).save(function(err){
                            if(err){
                                console.log("Error saving token to DB!");
                                res.json({msg: "Error saving token to DB!",
                                        errorid: "667"});
                            } else {
                                res.json({token: token});
                            }
                        });
                }
            });
        }
    });
});

module.exports = router;
