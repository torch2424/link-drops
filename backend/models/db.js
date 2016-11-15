var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Dump = new Schema({
  user_id: {
    type: String
  },
	title: {
    type: String
  },
  content: {
    type: String
  },
  updated_at: Date
});

var Label = new Schema({
    user_id: {
        type: String,
        ref: 'User'
    },
    title: {
        type: String
    },
    dumps: [{
        type: String,
        ref: 'Dump'
    }]
})

var User = new Schema({
  username: {
    type: String
  },
  password: {
    type: String
  },
  salt: String
});

var Session = new Schema({
  user_id: {
    type: String
  },
  token: {
    type: String
  }
});

mongoose.model('Dump', Dump);
mongoose.model('Label', Label);
mongoose.model('User', User);
mongoose.model('Session', Session);
mongoose.connect('mongodb://localhost/link-dump');
