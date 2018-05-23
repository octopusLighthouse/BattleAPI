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

// request /stats object
const statObject = {		
	most_active: {attacker_king: ``, defender_king: ``, region: ``},
	attacker_outcome: {win: 0, loss: 0},
	battle_type: [],
	defender_size: { average: 0, min: 0, max: 0}
};

// Collecting all data needed for statObject
function status(inp, out)
{
	Promise.all([mostActiveAttacker, mostActiveDefender, mostActiveRegion, attkOutcomWinLoss, battleTypes, defendSizeAvgMinMax])
		.then(function(value){
			out.send(value[0]);
		})
		.catch(function(error){
			out.send(error);
		});	
}

// request for attacker kings number (promise)
let mostActiveAttacker = new Promise(function(resolve, reject){
	let pipe = [];
	let groupedKings =  { $group: { _id:"$attacker_king", mostActiveKingBattles: {$sum: 1} } };
	pipe.push(groupedKings);
	let sortKings = {$sort: { 'mostActiveKingBattles': -1}}
	pipe.push(sortKings);
	let limitKings = {$limit: 1}
	pipe.push(limitKings);
	let query = Battles.aggregate(pipe);
	query.exec(function(err, ls){ 
		if (err) reject(err);
		statObject.most_active.attacker_king = ls[0]._id;
		resolve(statObject);
	});
});

// request for most active defender kings number
let mostActiveDefender = new Promise(function(resolve, reject){
	let pipe = [];
	let groupedKings =  { $group: { _id:"$defender_king", mostDefenderKingBattles: {$sum: 1} } };
	pipe.push(groupedKings);
	let sortKings = {$sort: { 'mostDefenderKingBattles': -1}}
	pipe.push(sortKings);
	let limitKings = {$limit: 1}
	pipe.push(limitKings);
	let query = Battles.aggregate(pipe);
	query.exec(function(err, ls){ 
		if (err) reject(err);
		statObject.most_active.defender_king = ls[0]._id;
		resolve(statObject);
	});
});

// request for most active region number
let mostActiveRegion = new Promise(function(resolve, reject){
	let pipe = [];
	let mActiveRegio =  { $group: { _id:"$region", mostActiveRegion: {$sum: 1} } };
	pipe.push(mActiveRegio);
	let sortRegio = {$sort: { 'mostActiveRegion': -1}}
	pipe.push(sortRegio);
	let limitRegio = {$limit: 1}
	pipe.push(limitRegio);
	let query = Battles.aggregate(pipe);
	query.exec(function(err, ls){ 
		if (err) reject(err);
		statObject.most_active.region = ls[0]._id;
		resolve(statObject);
	});
});

// Get outcome win loss
let attkOutcomWinLoss = new Promise(function(resolve, reject){
	let pipe = [];
	let grp = { $group: { _id: '$attacker_outcome', total: {$sum: 1} }};
	pipe.push(grp);
	let query = Battles.aggregate(pipe);
	query.exec(function(err, ls){ 
		if (err) reject(err);
		for (let i = 0; i < ls.length; i++){
			if (ls[i]._id === 'win'){ statObject.attacker_outcome.win = ls[i].total; } else
			if (ls[i]._id === 'loss'){ statObject.attacker_outcome.loss = ls[i].total; }
		}
		resolve(statObject);
	});
});

// Get battle types
let battleTypes = new Promise(function(resolve, reject){
	let pipe = [];
	let battleTypes =  { $group: { _id:"$battle_type"}};
	pipe.push(battleTypes);
	let query = Battles.aggregate(pipe);
	query.exec(function(err, ls){ 
		if (err) reject(err);
		for (let val in ls) {
			statObject.battle_type.push(ls[val]._id);
		}
		resolve(statObject);
	});
});

// Get Average MIn and Max of defender_size
let defendSizeAvgMinMax = new Promise(function(resolve, reject){
	let pipe = [];
	let avgDefenderSize =  { $group: { _id: 0, average: {$avg: "$defender_size"} ,  min: {$min: "$defender_size"} ,  max: {$max: "$defender_size"}}};
	pipe.push(avgDefenderSize);
	let query = Battles.aggregate(pipe);
	query.exec(function(err, ls){ 
		if (err) reject(err);
		statObject.defender_size.average = ls[0].average;
		statObject.defender_size.min = ls[0].min;
		statObject.defender_size.max = ls[0].max;
		resolve(statObject);
	});
});

// export
module.exports.status = status;