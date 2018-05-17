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
// --------------------------------------------------------------------------------------------
// end of file
// --------------------------------------------------------------------------------------------