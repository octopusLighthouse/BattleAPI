// --------------------------------------------------------------------------------------------
// Description: Task
// Author: Robertas Bauras
// Create date: 2018.05.02
// Modify date: 2018.05.16
// --------------------------------------------------------------------------------------------
// https://enigmatic-chamber-75142.herokuapp.com/ | https://git.heroku.com/enigmatic-chamber-75142.git
// --------------------------------------------------------------------------------------------
// includes
// --------------------------------------------------------------------------------------------
var express = require('express');
var mongoose = require('./libs/mongoose');
var Battles = require('./models/battles').battles;
var app = express();
//mongoose.set('debug', true);
// --------------------------------------------------------------------------------------------
// server port
// --------------------------------------------------------------------------------------------
app.set('port', process.env.PORT || 5000);
// --------------------------------------------------------------------------------------------
// routes
// --------------------------------------------------------------------------------------------
app.get('/', function(inp, out){ out.send("Please use correct API v1.0.0"); });
app.get('/list', list);
app.get('/count', count);
app.get('/stats', status);
app.get('/search', search);
app.listen(app.get('port'));
// --------------------------------------------------------------------------------------------
// battles list function
// --------------------------------------------------------------------------------------------
function list(inp, out){
	let query = Battles.aggregate([				
		{
			$group: {_id:0, battlePlaces: {$addToSet: '$location'}}
		}
		//,{$project: {_id:0, battlePlaces: 1}}
	]);

	query.exec(function(err, ls){ 
		out.send(ls[0].battlePlaces); 
	});
}
// --------------------------------------------------------------------------------------------
// battles count function
// --------------------------------------------------------------------------------------------
function count(inp, out){
	Battles.find({},
		function(err, list)
		{
			if (err) return err;
			var le = list.length;	
			out.send({battles_occurred: le});
		}).select('location');
}
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

	let groupedKings =  { $group: { _id:"$region", mostActiveRegion: {$sum: 1} } };
	pipe.push(groupedKings);

	let sortKings = {$sort: { 'mostActiveRegion': -1}}
	pipe.push(sortKings);

	let limitKings = {$limit: 1}
	pipe.push(limitKings);

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



	let atou =  { $match: { attacker_outcome: "win" } };
	pipe.push(atou);
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
		let atou =  { $match: { attacker_outcome: "loss" } };
		pipe.push(atou);
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

		let x =  { $group: { _id:"$battle_type"}};
		pipe.push(x);


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

		let x =  { $group: { _id: 0, avg: {$avg: "$defender_size"}}};
		pipe.push(x);


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

		let x =  { $group: { _id: 0, min: {$min: "$defender_size"}}};
		pipe.push(x);


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

		let x =  { $group: { _id: 0, max: {$max: "$defender_size"}}};
		pipe.push(x);


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
// Main stat request function
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
	.catch(error => out.send(error) );

}
// --------------------------------------------------------------------------------------------
// AtackerKing and DefenderKing search function for search request 
// available parameters king location and type
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
	q.exec(function(err, ls){ out.send(ls); });
}

// --------------------------------------------------------------------------------------------
// End of file
// --------------------------------------------------------------------------------------------


