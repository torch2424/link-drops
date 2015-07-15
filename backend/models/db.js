var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var link = new Schema({
    user_id    : String,
    content    : String,
    updated_at : Date
});

mongoose.model( 'link', link );
mongoose.connect( 'mongodb://localhost/link-dump' );
