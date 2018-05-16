




var mongoose = require('./../libs/mongoose');

var schema_of_user = mongoose.Schema({
		name: String,
		age: Number
});

exports.user = mongoose.model('user', schema_of_user, 'user');



