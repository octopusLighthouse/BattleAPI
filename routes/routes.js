// --------------------------------------------------------------------------------------------
// Description: Routes
// Author: Robertas Bauras
// Create date: 2018.05.02
// Modify date: 2018.05.16
// --------------------------------------------------------------------------------------------
var express = require('express');
var mongoose = require('../libs/mongoose');
var Battles = require('../models/battles').battles;
var config = require('../config/index.js');
// --------------------------------------------------------------------------------------------
// Error route
// --------------------------------------------------------------------------------------------
function error(inp, out){
	out.send(`Please use correct API v${config.get('apiVersion')}`);
}



// --------------------------------------------------------------------------------------------
// AtackerKing and DefenderKing search function for search request 
// available parameters king location and type
// if no parameters set result will be all kings at any location and battletype
// --------------------------------------------------------------------------------------------
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

function all(i,o)
{
		let pipe = [];
		let attackerOutcomeWin =  { $project: {_id:0} };
		pipe.push(attackerOutcomeWin);
		


		let query = Battles.aggregate(pipe);
		query.exec(function(err, ls){ 
			if (err) o.send(err);
				o.send(ls);
		});
	

};

function test(i,o)
{
		let pipe = [];

		let group =  { $group: {_id: '$attacker_king' , ginyba: {$push :'$defender_king'}} };
		pipe.push(group);
		
		/*
		let group =  { $group: {_id: '$attacker_king' , besiginantys: {$push :'$defender_king'}, uzpuolimuKiekis : { $sum : 1 }} };
		pipe.push(group);

		let unwind =  { $unwind: '$besiginantys' };		
		pipe.push(unwind);

		let group2 =  { $group: {_id: '$besiginantys' ,  Uzpuolikas: {$addToSet :'$_id'}, uzpuolimuKiekis: { $addToSet: "$uzpuolimuKiekis" }, ginimusiKiekis : { $sum : 1 }} };		
		pipe.push(group2);
		*/

		let query = Battles.aggregate(pipe);
		query.exec(function(err, ls){ 
			if (err) o.send(err);
				o.send(ls);
		});
	

};

// --------------------------------------------------------------------------------------------
// export
// --------------------------------------------------------------------------------------------
module.exports.test = test;
module.exports.all = all;
module.exports.error = error;
module.exports.search = search;
// --------------------------------------------------------------------------------------------
// end of file
// --------------------------------------------------------------------------------------------