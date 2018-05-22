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

// battles list function
function list(inp, out){
	let query = Battles.aggregate([{$group: {_id:0, battlePlaces: {$addToSet: '$location'}}}]);
	query.exec(function(err, ls){ 
		if (err) {
			console.log(err); 
			out.send(err);
		}
		out.send(ls[0].battlePlaces);
	});
}

//
module.exports.list = list;
