var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var Dump = new Schema({
    user_id    : String,
    content    : String,
    updated_at : Date
});

var User = new Schema({
    username : String,
    password : String,
    salt     : String
});

var Session = new Schema({
    user_id : String,
    token   : String
});

mongoose.model( 'Dump', Dump );
mongoose.model( 'User', User );
mongoose.model( 'Session', Session );
mongoose.connect( 'mongodb://localhost/link-dump' );
