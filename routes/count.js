/**
* Description: Task
* Author: Robertas Bauras
* Create date: 2018.05.02
* Modify date: 2018.05.21
*/
let express = require('express');
let mongoose = require('../libs/mongoose');
let Battles = require('../models/battles').battles;
let config = require('../config/index.js');

// battles count function
function countBattles(inp, out){
	Battles.find({},
		function(err, list)
		{
			if (err) out.send(err);
			let le = list.length;	
			out.send({battles_occurred: le});
		}).select('location');
}
module.exports.count = countBattles;