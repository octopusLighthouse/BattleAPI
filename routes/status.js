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
// request for attacker kings number (promise)
// --------------------------------------------------------------------------------------------
function requestForMostActiveAttackerKing (strr){

	let structure = []
	let promise = new Promise(function(resolve, reject){
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
			strr.most_active.attacker_king = ls[0]._id;
			resolve(strr);
		});
	});
	return promise;
}
// --------------------------------------------------------------------------------------------
// request for most active defender kings number
// --------------------------------------------------------------------------------------------
function requestForMostActiveDefenderKing (statArray){
	let promise = new Promise(function(resolve, reject){
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
			statArray.most_active.defender_king = ls[0]._id;
			resolve(statArray);
		});
	});
	return promise;
}
// --------------------------------------------------------------------------------------------
// request for most active region number
// --------------------------------------------------------------------------------------------
function requestForMostActiveRegion(statArray){
	let promise = new Promise(function(resolve, reject){
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
			statArray.most_active.region = ls[0]._id;
			resolve(statArray);
		});
	});
	return promise;
}
// --------------------------------------------------------------------------------------------
//
// --------------------------------------------------------------------------------------------
function requestForAtackerOutcomeWin(statArray){
	let promise = new Promise(function(resolve, reject){
		let pipe = [];
		let attackerOutcomeWin =  { $match: { attacker_outcome: "win" } };
		pipe.push(attackerOutcomeWin);
		let x =  { $group: { _id:"$attacker_outcome", total: {$sum: 1} } };
		pipe.push(x);


		let query = Battles.aggregate(pipe);
			query.exec(function(err, ls){ 
				if (err) reject(err);
				statArray.attacker_outcome.win = ls[0].total;
				resolve(statArray);
			});
	});
	return promise;
}
// --------------------------------------------------------------------------------------------
//
// --------------------------------------------------------------------------------------------
function requestForAtackerOutcomeLoss(statArray){
	let promise = new Promise(function(resolve, reject){
		let pipe = [];
		let attackerOutcomeLoss =  { $match: { attacker_outcome: "loss" } };
		pipe.push(attackerOutcomeLoss);
		let x =  { $group: { _id:"$attacker_outcome", total: {$sum: 1} } };
		pipe.push(x);
		let query = Battles.aggregate(pipe);
		query.exec(function(err, ls){ 
				if (err) reject(err);
				statArray.attacker_outcome.loss = ls[0].total;
				resolve(statArray);
			});
	});
	return promise;
}
// --------------------------------------------------------------------------------------------
//
// --------------------------------------------------------------------------------------------
function requestForBattleTypes(statArray){
	let promise = new Promise(function(resolve, reject){
		let pipe = [];
		let battleTypes =  { $group: { _id:"$battle_type"}};
		pipe.push(battleTypes);
		let query = Battles.aggregate(pipe);
		query.exec(function(err, ls){ 
				if (err) reject(err);
				for (var val in ls) {
					statArray.battle_type.push(ls[val]._id);
				}
				resolve(statArray);
			});
	});
	return promise;
}
// --------------------------------------------------------------------------------------------
//
// --------------------------------------------------------------------------------------------
function requestForDefenderSizeAvg(statArray){
	let promise = new Promise(function(resolve, reject){
		let pipe = [];
		let avgDefenderSize =  { $group: { _id: 0, avg: {$avg: "$defender_size"}}};
		pipe.push(avgDefenderSize);
		let query = Battles.aggregate(pipe);
		query.exec(function(err, ls){ 
				if (err) reject(err);
				statArray.defender_size.average = ls[0].avg;
				resolve(statArray);
			});
	});
	return promise;
}
// --------------------------------------------------------------------------------------------
//
// --------------------------------------------------------------------------------------------
function requestForDefenderSizeMin(statArray){
	let promise = new Promise(function(resolve, reject){
		let pipe = [];
		let minDefenderSize =  { $group: { _id: 0, min: {$min: "$defender_size"}}};
		pipe.push(minDefenderSize);
		let query = Battles.aggregate(pipe);
		query.exec(function(err, ls){ 
				if (err) reject(err);
				statArray.defender_size.min = ls[0].min;
				resolve(statArray);
			});
	});
	return promise;
}
// --------------------------------------------------------------------------------------------
//
// --------------------------------------------------------------------------------------------
function requestForDefenderSizeMax(statArray){
	let promise = new Promise(function(resolve, reject){
		let pipe = [];
		let maxDefenderSize =  { $group: { _id: 0, max: {$max: "$defender_size"}}};
		pipe.push(maxDefenderSize);
		let query = Battles.aggregate(pipe);
		query.exec(function(err, ls){ 
				if (err) reject(err);
				statArray.defender_size.max = ls[0].max;
				resolve(statArray);
			});
	});
	return promise;
}
// --------------------------------------------------------------------------------------------
// Main stat request function uses promises
// --------------------------------------------------------------------------------------------
function status(inp, out)
{
	const statObject = {		
		most_active: {attacker_king: ``, defender_king: ``, region: ``},
		attacker_outcome: {win: 0, loss: 0},
		battle_type: [],
		defender_size: { average: 0, min: 0, max: 0}
	};

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

}

module.exports.status = status;