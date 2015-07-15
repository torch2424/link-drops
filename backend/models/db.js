var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var link = new Schema({
    user_id    : String,
    content    : String,
    updated_at : Date
});

var user = new Schema({
    username : String,
    password : String,
    salt     : String
});

var session = new Schema({
    user_id : String,
    token   : String
});

mongoose.model( 'link', link );
mongoose.model( 'user', user );
mongoose.model( 'session', session );
mongoose.connect( 'mongodb://localhost/link-dump' );
