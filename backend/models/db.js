var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var Dump = new Schema({
    user_id:
    {
        type: String,
        required: 'The User Id is required'
    },
    content:
    {
        type: String,
        required: 'The Dump Content is required'
    },
    updated_at: Date
});

var User = new Schema({
    username:
    {
        type: String,
        required: 'The User Name is required'
    },
    password:
    {
        type: String,
        required: 'The Password is required'
    },
    salt: String
});

var Session = new Schema({
    user_id:
    {
        type: String,
        required: 'The User Id is required'
    },
    token:
    {
        type: String,
        required: 'The sessionToken is required'
    }
});

mongoose.model( 'Dump', Dump );
mongoose.model( 'User', User );
mongoose.model( 'Session', Session );
mongoose.connect( 'mongodb://localhost/link-dump' );
