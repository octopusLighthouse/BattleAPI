/**
* Description: Task
* Author: Robertas Bauras
* Create date: 2018.05.02
* Modify date: 2018.05.21
*/
let mongoose = require('./../libs/mongoose');
let schema = require('./../schemas/battles');

exports.battles = mongoose.model('battles', schema.battles, 'battles');