// ---------------------------------------------------------------------
// Author: Robertas Bauras
// Decription: Task
// ---------------------------------------------------------------------
// Modules
// ---------------------------------------------------------------------
const exp = require('express');
const gameServer = exp();
// ---------------------------------------------------------------------
var port = process.env.PORT || 8000;
// ---------------------------------------------------------------------
// Routes please use corect api commands.
// ---------------------------------------------------------------------
gameServer.get('/', (input, output) => { output.send("please use corect api commands."); } );
// ---------------------------------------------------------------------
// Run API server
// ---------------------------------------------------------------------






gameServer.listen(port);
// ---------------------------------------------------------------------
// End of file.
// ---------------------------------------------------------------------
