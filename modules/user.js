var mongoose = require('./../libs/mongoose');
//{"longitude": "123456", "latitude": "987654", "comment": "Pagavau zuvi negaudes", "fishName": "Maximos karpis", "fishImage": "www.maxima.lt/nabagas/karpis.jpg"}

/*
exports.Record = mongoose.model(
	'fishers', 
	{longitude: String, latitude: String, comment: String, fishName: String, fishImage: String}, 
	'fishers');
	*/


exports.FISHERS = mongoose.model(
	'fishers', 
	{longitude: String, latitude: String, comment: String, fishName: String, fishImage: String}, 
	'fishers');
