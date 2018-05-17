// --------------------------------------------------------------------------------------------
// Description: Routes
// Author: Robertas Bauras
// Create date: 2018.05.02
// Modify date: 2018.05.17
// --------------------------------------------------------------------------------------------
var nconf = require('nconf');
var path = require('path');
nconf.argv().env().file({ file: path.join(__dirname, 'config.json') });
module.exports = nconf;