/*
const mongoose = require('mongoose');
var currentDBid = 2;
var databases = ['game', 'monopoly', 'octopus'];

var connection = mongoose.createConnection('mongodb://citrus:abc1983@ds111390.mlab.com:11390/' + databases[currentDBid]);
var Octopus = connection.model('Octopus', { latitude: 'double', longitude: 'double', comment: 'string'}, 'Octopus');
var newOctopus = new Octopus({ latitude: 10, longitude: 12, comment: 'an apple'});


newOctopus.save(
		function(err)
		{
			if (err) 
				{return handleError(err);}
			else{
				console.log('Meow');
			}
		}
	);
*/