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

// AtackerKing and DefenderKing search function for search request 
// available parameters king location and type
// if no parameters set result will be all kings at any location and battletype
function search(inp, out){

	let {king, location, type} = inp.query;
	let aggArray = [];

	if (king !== undefined && king !== ``)
	{
		let match1 = { $match: { $or: [{attacker_king: king}, {defender_king: king}]}};
		aggArray.push(match1);
	}

	if (location !== undefined && location !== ``)
	{
		let match1 = { $match: {location: location}};
		aggArray.push(match1);
	}

	if (type !== undefined && type !== ``)
	{
		let match1 = { $match: {battle_type: type}};
		aggArray.push(match1);
	}
	
	aggArray.push({ $project: {_id: 0, name: 1, attacker_king: 1, defender_king: 1, location: 1, battle_type: 1}});
	let q = Battles.aggregate(aggArray);
	q.exec(function(err, ls){ 
		if (err) out.send(err);
		out.send(ls); });
}

//
module.exports.search = search;
