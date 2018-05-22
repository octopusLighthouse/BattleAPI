/**
* Description: Task
* Author: Robertas Bauras
* Create date: 2018.05.02
* Modify date: 2018.05.21
*/
var express = require('express');
var mongoose = require('../libs/mongoose');
var Battles = require('../models/battles').battles;
var config = require('../config/index.js');

// battles count function
function countBattles(inp, out){
	Battles.find({},
		function(err, list)
		{
			if (err) out.send(err);
			var le = list.length;	
			out.send({battles_occurred: le});
		}).select('location');
}
module.exports.count = countBattles;