/**
* Description: Task
* Author: Robertas Bauras
* Create date: 2018.05.02
* Modify date: 2018.05.21
*/
var mongoose = require('./../libs/mongoose');
var schema = require('./../schemas/battles');

exports.battles = mongoose.model('battles', schema.battles, 'battles');