var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Dump = mongoose.model('Dump');
var Label = mongoose.model('Label');
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
					title: req.body.title,
          updated_at: Date.now()
        }).save(function(err, dump, count) {
          //.save will save our new link object in the backend
          if (err) {
            res.status(500).json({
              msg: "Error saving the dump!"
            });
          } else {
            dump = dump.toObject();
            dump.labels = [];
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
        }).sort('-updated_at').lean().exec(function(err, dumps, count) {
          if (err) {
            res.status(500).json({
              msg: "Couldn't search the database for dumps!"
            });
          } else {
            getLabels(dumps, 0);
          }
        });
      }
    });

  function getLabels(dumps, counter) {
    if (dumps.length > 0) {
      Label.find({
        dumps: dumps[counter]._id
      }).lean().exec(function(err, labels) {
        if (err) {
          res.status(500).json({
            msg: "Couldn't search the database for labels!"
          });
        } else {
          dumps[counter].labels = labels;

          if (counter == dumps.length - 1) {
            finish(dumps);
          } else {
            getLabels(dumps, counter + 1);
          }
        }
      });
    }
  }

  function finish(dumps) {
    res.status(200).json(dumps);
  }
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

//Migrate to titlebased backend
router.get('/addTitles', function(req, res) {

    Dump.find({
    }, function(err, dumps) {
      if (err) {
        res.status(500).json({
          msg: "Couldn't search the database for dump!"
        });
      } else if (!dumps) {
        res.status(404).json({
          msg: "Dump does not exist!"
        });
      } else {
				populateTitles(dumps, 0);
				res.status(200).json({
					msg: "Started Dump Titling Process"
				});
      }
    });

});

function populateTitles(dumps, i){
		if(dumps[i].title){
			console.log("Link Already Updated");
			if(i+1 < dumps.length){
				populateTitles(dumps, i+1);
			}
		} else {
			getURLTitle(dumps[i], function(title, dump){
				//Simply change the variables of think
				dump.title = title;

				//Save the modified
				dump.save(function(err, savedDump, count) {
					console.log("updated a dump: ", savedDump)
				});
			});
			if(i+1 < dumps.length){
				setTimeout(function(){
					populateTitles(dumps, i+1);
				}, 750);
			}
		}
}

//Get the title of a link
function getURLTitle(dump, callback) {

		var request = require('request');

	  // Set the headers
	  var headers = {
	      'User-Agent':       'Super Agent/0.0.1',
	      'Content-Type':     'application/x-www-form-urlencoded',
	      'Accept':           'application/json'
	  }

	  // Configure the request
	  var options = {
	      url: "https://dev.kondeo.com/api/title-scraper.php?q=" + dump.content,
	      method: 'GET',
	      headers: headers
	  }

	  // Start the request
	  request(options, function (error, response, body) {
	      if (!error) {
	          // Print out the response body
	          var data = JSON.parse(body);
	          callback(data.title, dump);
	      } else {
	          console.log("failded");
	      }
	  });
}

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
              if (err) {
                res.status(500).json({
                  msg: "Couldn't delete dump from database"
                });
              } else {
                Label.find({
                  user_id: session.user_id,
                  dumps: req.params.id
                }).select("_id").lean().exec(function(err, labels) {
                  if (err) {
                    res.status(500).json({
                      msg: "Couldn't search the database for labels!"
                    });
                  } else if (!labels) {
                    res.status(200).json(dump);
                  } else {
                    res.status(200).json(dump);
                    for (var i = 0; i < labels.length; i++) {
                      Label.findByIdAndUpdate(
                        labels[i]._id, {
                          $pull: {
                            dumps: dump._id
                          }
                        }, {
                          new: true
                        }).exec(function(err, label) {
                        if (err) {
                          console.log({
                            msg: "Couldn't search the database for labels during delete!"
                          });
                        } else {
                          if (label.dumps.length == 0) {
                            label.remove(function(err, label) {
                              console.log({
                                msg: "Couldn't delete empty label!"
                              });
                            });
                          }
                        }
                      });
                    }
                  }
                });
              }
            });
          }
        });

      }
    });
});


module.exports = router;
