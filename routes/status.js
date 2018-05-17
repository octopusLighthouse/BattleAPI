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



const statObject = {		
		most_active: {attacker_king: ``, defender_king: ``, region: ``},
		attacker_outcome: {win: 0, loss: 0},
		battle_type: [],
		defender_size: { average: 0, min: 0, max: 0}
	};


let fu1 = new Promise(function(resolve,reject){
	//console.log('Labas barbaras!');
	resolve({a:'abc'});
});


// --------------------------------------------------------------------------------------------
// Main stat request function uses promises
// --------------------------------------------------------------------------------------------
function status(inp, out)
{
	
/*
	requestForMostActiveAttackerKing(statObject)
	.then(status => requestForMostActiveDefenderKing(status))
	.then(status => requestForMostActiveRegion(status))
	.then(status => requestForAtackerOutcomeWin(status))
	.then(status => requestForAtackerOutcomeLoss(status))
	.then(status => requestForBattleTypes(status))
	.then(status => requestForDefenderSizeAvg(status))
	.then(status => requestForDefenderSizeMin(status))
	.then(status => requestForDefenderSizeMax(status))
	.then(st => out.send(st))
	.catch(error => out.send(error));
	*/



	Promise.all([mostActiveAttacker, mostActiveDefender, mostActiveRegion, attkOutcomWin, attkOutcomLoss, battleTypes, defSizeAvg, defSizeMin, defSizeMax])
		.then(function(value){
			out.send(value[0]);
		})
		.catch(function(error){
			out.send(error[0]);
		});	

}

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
// --------------------------------------------------------------------------------------------
// request for attacker kings number (promise)
// --------------------------------------------------------------------------------------------
/*function requestForMostActiveAttackerKing (strr){

	let structure = []*/

	
	/*return promise;
}*/
// --------------------------------------------------------------------------------------------
// request for most active defender kings number
// --------------------------------------------------------------------------------------------
/*function requestForMostActiveDefenderKing (statArray){*/
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
//return promise;
//}
// --------------------------------------------------------------------------------------------
// request for most active region number
// --------------------------------------------------------------------------------------------
//function requestForMostActiveRegion(statArray){
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
//return promise;
//}
// --------------------------------------------------------------------------------------------
//
// --------------------------------------------------------------------------------------------
//function requestForAtackerOutcomeWin(statArray){
	let attkOutcomWin = new Promise(function(resolve, reject){
		let pipe = [];
		let attackerOutcomeWin =  { $match: { attacker_outcome: "win" } };
		pipe.push(attackerOutcomeWin);
		let x =  { $group: { _id:"$attacker_outcome", total: {$sum: 1} } };
		pipe.push(x);


		let query = Battles.aggregate(pipe);
			query.exec(function(err, ls){ 
				if (err) reject(err);
				statObject.attacker_outcome.win = ls[0].total;
				resolve(statObject);
			});
	});
//	return promise;
//}
// --------------------------------------------------------------------------------------------
//
// --------------------------------------------------------------------------------------------
//function requestForAtackerOutcomeLoss(statArray){
	let attkOutcomLoss = new Promise(function(resolve, reject){
		let pipe = [];
		let attackerOutcomeLoss =  { $match: { attacker_outcome: "loss" } };
		pipe.push(attackerOutcomeLoss);
		let x =  { $group: { _id:"$attacker_outcome", total: {$sum: 1} } };
		pipe.push(x);
		let query = Battles.aggregate(pipe);
		query.exec(function(err, ls){ 
				if (err) reject(err);
				statObject.attacker_outcome.loss = ls[0].total;
				resolve(statObject);
			});
	});
//	return promise;
//}
// --------------------------------------------------------------------------------------------
//
// --------------------------------------------------------------------------------------------
//function requestForBattleTypes(statArray){
let battleTypes = new Promise(function(resolve, reject){
	let pipe = [];
	let battleTypes =  { $group: { _id:"$battle_type"}};
	pipe.push(battleTypes);
	let query = Battles.aggregate(pipe);
	query.exec(function(err, ls){ 
			if (err) reject(err);
			for (var val in ls) {
				statObject.battle_type.push(ls[val]._id);
			}
			resolve(statObject);
		});
});
//	return promise;
//}
// --------------------------------------------------------------------------------------------
//
// --------------------------------------------------------------------------------------------
//function requestForDefenderSizeAvg(statArray){
let defSizeAvg = new Promise(function(resolve, reject){
	let pipe = [];
	let avgDefenderSize =  { $group: { _id: 0, avg: {$avg: "$defender_size"}}};
	pipe.push(avgDefenderSize);
	let query = Battles.aggregate(pipe);
	query.exec(function(err, ls){ 
			if (err) reject(err);
			statObject.defender_size.average = ls[0].avg;
			resolve(statObject);
		});
});
//	return promise;
//}
// --------------------------------------------------------------------------------------------
//
// --------------------------------------------------------------------------------------------
//function requestForDefenderSizeMin(statArray){
let defSizeMin = new Promise(function(resolve, reject){
	let pipe = [];
	let minDefenderSize =  { $group: { _id: 0, min: {$min: "$defender_size"}}};
	pipe.push(minDefenderSize);
	let query = Battles.aggregate(pipe);
	query.exec(function(err, ls){ 
			if (err) reject(err);
			statObject.defender_size.min = ls[0].min;
			resolve(statObject);
		});
});
//	return promise;
//}
// --------------------------------------------------------------------------------------------
//
// --------------------------------------------------------------------------------------------
//function requestForDefenderSizeMax(statArray){
let defSizeMax = new Promise(function(resolve, reject){
	let pipe = [];
	let maxDefenderSize =  { $group: { _id: 0, max: {$max: "$defender_size"}}};
	pipe.push(maxDefenderSize);
	let query = Battles.aggregate(pipe);
	query.exec(function(err, ls){ 
			if (err) reject(err);
			statObject.defender_size.max = ls[0].max;
			resolve(statObject);
		});
});
//	return promise;
//}


module.exports.status = status;