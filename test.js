// ---------------------------------------------------------------------
// Author: Robertas Bauras
// Decription: Task
// ---------------------------------------------------------------------
// Modules
// ---------------------------------------------------------------------
const exp = require('express');
const mongoose = require('mongoose');
const gameServer = exp();
// ---------------------------------------------------------------------
var port = process.env.PORT || 8000;
// ---------------------------------------------------------------------
// Routes please use corect api commands.
// ---------------------------------------------------------------------
gameServer.get('/', (input, output) => { output.send("please use correct api commands."); } );
// ---------------------------------------------------------------------
// Run API server
// ---------------------------------------------------------------------


/*
mongoose.connect('mongodb://citrus:abc1983@ds111390.mlab.com:11390/game');
var conn = mongoose.connection; 
conn.on('error', console.error.bind(console, 'connection error:')); 
conn.once('open', function() 
{
	const mong_model = module.exports = mongoose.model('Game', customerSchema, 'Game');

  	console.log('---Atsidare ?:D');
  	conn.close();
});
conn.on('close', function() { console.log('...uzsidare'); } );
*/



gameServer.listen(port);
// ---------------------------------------------------------------------
// End of file.
// ---------------------------------------------------------------------
