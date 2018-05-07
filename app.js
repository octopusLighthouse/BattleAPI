// --------------------------------------------------------------
// Description: .... ... ....
// Author: Jonas Jonaitis
// Create date: 2019.07.07
// Modify date: 2020.05.07
// --------------------------------------------------------------

/*
const mongoose = require('mongoose');
mongoose.connect('mongodb://citrus:abc1983@ds111390.mlab.com:11390/octopus');

const Cat = mongoose.model('lentele', { name: String }, 'lentele');

const kitty = new Cat({ name: 'Zildjian' });
kitty.save().then(() => console.log('meow'));
*/
var express = require('express');
var Async = require('async');
var mongoose = require('./libs/mongoose');
var FishersObj = require('./modules/user').FISHERS;

var app = express();
var port = process.env.PORT || 8000;
app.get('/', function(inp, out, nxt){ out.send("Please use correct API."); });

app.get('/fish', function(inp, out, nxt)
		{
			FishersObj.find({},
			function(err, list)
			{
				if (err) return nxt(err);		
				out.send(list);
			});
		}
	);


app.listen(port);
/*
// -------------------------------------------------------
// veikiantis examplas
// -------------------------------------------------------
Async.series([
		open,
		get
	]
	, function(err){mongoose.disconnect(); console.log('All done.'); });


function open(callback) {
	console.log('Opening ...');
	mongoose.connection.on('open', callback);
}

function get(callback) {
	FishersObj.find({},
		function(err, list)
		{
			console.log(list);
			callback();	
		});
}
*/


/*
var rek = new Rek(
	{ longitude: "102", 
	latitude: "103", 
	comment: "Labas pagavau cia zuvi.",
	fishName: "Saspi",
	fishImage: "http://www.fishbase.org/images/thumbnails/jpg/tn_Saspi_u0.jpg"
});
*/
/*
rek.save(function(err, user, affected){
	console.log(arguments);
});
*/

/*
mongoose.connection.on('open',function(){
	FishersObj.find({"longitude": "123456"},
		function(err, list)
		{
			console.log(list);	
			mongoose.disconnect();		
		});
});
*/


