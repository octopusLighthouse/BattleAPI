/**
* Description: Task
* Author: Robertas Bauras
* Create date: 2018.05.02
* Modify date: 2018.05.21
*/
let nconf = require('nconf');
let path = require('path');
nconf.argv().env().file({ file: path.join(__dirname, 'config.json') });
module.exports = nconf;