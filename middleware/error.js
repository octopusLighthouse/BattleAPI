/**
* Description: Task
* Author: Robertas Bauras
* Create date: 2018.05.02
* Modify date: 2018.05.21
*/
let express = require('express');
let config = require('../config/index.js');

// Error route
function error(inp, out){
	out.send(`Please use correct API v${config.get('apiVersion')}`);
}

// export
module.exports.error = error;