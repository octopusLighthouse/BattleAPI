// --------------------------------------------------------------------------------------------
// Description: Task
// Author: Robertas Bauras
// Create date: 2018.05.02
// Modify date: 2018.05.16
// --------------------------------------------------------------------------------------------
/*
C:\node\Heroku>heroku create
Creating app... done, ⬢ enigmatic-chamber-75142
https://enigmatic-chamber-75142.herokuapp.com/ | https://git.heroku.com/enigmatic-chamber-75142.git

C:\node\Heroku>
*/
// --------------------------------------------------------------------------------------------
// includes
// --------------------------------------------------------------------------------------------
var express = require('express');
var async = require('async');
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




/*
Async.series([getCountWin,getCountLoss],
		function(){
			out.send(
				{attacker_outcome:{win:numOfWins, loss:numOfLoss}}
			);});
*/

/*
var name = 'Robertas';
var age = 34;

myObject.method({name, age});
{
	name: name,
	age: age
}
*/


//var noNamez   =   xx    =>    console.log(xx)    ;
//var skaicius = 2018;
//var myName = `Robertas Bauras ${skaicius}`;
//gulbe2(`Labas ${this.parameters}`);
//function gulbe2(x){console.log(x);}

/*
async.parallel([
		function(callback){ 
			console.log('Parallel Step 1'); 
			for(var i = 0; i < 10; i++){
				console.log('-----');
				console.log(`Labas,  \`\`   ${i+1} tai mano skaicius`);
			}
			callback();
		},
		function(callback){ 
			console.log('Parallel Step 2'); 
			callback();
		},
		function(callback){ 
			console.log('Parallel Step 3'); 
			callback();
		}
	], function(){ console.log('Parallel Done'); });

async.series([
		function(callback){ 
			console.log('Serial Step 1'); 
			callback();
		},
		function(callback){ 
			console.log('Serial Step 2'); 
			callback();
		},
		function(callback){ 
			console.log('Serial Step 3'); 
			callback();
		}

	], function(){ console.log('Serial Done'); });
*/
/*
var u = new User(
	{
		name: 'Robertas',
     	age: 35
    });

u.save(function(er, u, affected){ 
	if (er) throw er;
	console.log(arguments);


});
*/

//console.log(u);











app.get('/all', function(inp, out)
		{
			mongoose.model('battles').find({},
			function(err, list)
			{
				if (err) return nxt(err);		
				out.send(list);
			});

			/*
			// Veikia - parodo visus irasus...
			Battles.find({},
			function(err, list)
			{
				if (err) return nxt(err);		
				out.send(list);
			});
			*/
		}
	);







var numOfWins = 0, numOfLoss = 0;

function getCountWin (callback){
	Battles.find({attacker_outcome: 'win'}, // filtras
			function(err, list)
			{
				if (err) return err;
				var le = list.length;
				numOfWins = le;
				callback();
			});
}

function getCountLoss (callback){
	Battles.find({attacker_outcome: 'loss'}, // filtras
			function(err, list)
			{
				if (err) return err;
				var le = list.length;
				numOfLoss = le;
				callback();
			});
}





	//var sKing = inp.query.king;
	//var sLocation = inp.query.location;
	//var sType = inp.query.type;
	//$match: { $or: [{ author: 'dave' }, { author: 'john' }] }













	/*
	if (king === undefined || king === ``) {
		out.send([]);
	}
	else{
		let matchi = { $match: { $or: [{attacker_king: king}, {defender_king: king}]}};
		let aggArray = [matchi];
		*/

/*
		if (location !== undefined && king !== ``)
		{

		}
		*/

		//let q = Battles.aggregate(aggArray);
		//q.exec(function(err, ls){ out.send(ls); });
		
	//}

	

	/*
	var q = Battles.aggregate([
	
		{ $match: 
			{ $or: 
				[{attacker_king: king}, {defender_king: king}]}},

		{ $project: {_id: 0, attacker_king: 1, defender_king: 1}}

	]);
	*/

	// RANDOM -> var q = Battles.aggregate([ {$sample: {size: 2} } ]);

	
	
	//var q = Battles.aggregate([

		//{$match: },

		//{$match: {location: location}},//battle_type
		//{$match: {battle_type: type}},
		//{$sort: {name: 1}},
		//{$project: {_id: 0, name: 1, attacker_king: 1, defender_king: 1}}
	//]);	
	

	



app.get('/...', testFunction);


function testFunction(inp, out) {

	var q = Battles.aggregate([
	
		{ $match: {summer: 0}},
		{ $match: {attacker_king: 'Stannis Baratheon'}},
		{ $project: {_id: 0, summer: 1, battle_number: 1, name: 1, location: 1}}

	]);
	
	q.exec(function(err, ls){ out.send(ls); });
}


function testFunction1(inp, out) {

	var attacker_king = 'Rom';
	var defender_king = 'Ket';
	var region = 'Vilnius';
	var name = 'War forest';
	var cats = ['Murki','Surki','Barboski'];
	var attacker_outcome = {'win':115,'loss':100};
	var most_active = {
		'attacker_king':attacker_king,
		'defender_king':defender_king,
		'region':region,
		'name':name
	};
	var defSize = {'average':0,'min':0,'max':0};
	var oo = {most_active,"attacker_outcome":attacker_outcome,'battle_type':cats,'defender_size':defSize};


	out.send(oo);

	/*
	Battles.find(function(err, ls){

		out.send(ls);
	});
	*/
	/*
	Battles.find({name:/Win/}, 'name', function(err, ls){

		out.send(ls);
	});
	*/
	/*
	var query = Battles.find({}, 'name');
	query.exec(function(err, ls){ out.send(ls); });
	*/
	/*
	var query = Battles.find().where('name',/Oxcross/);
	query.exec(function(err, ls){ out.send(ls); });
	*/
	/*
	var q = Battles.find().limit(2);
	q.exec(function(err, ls){ out.send(ls); });
	*/
	// --- parodo viskas ! 
	/*
	var q = Battles.find({});
	q.exec(function(err, ls){ out.send(ls); });
	*/
	/*
	// parodo tik stulpelius NAME ir YEAR
	var q = Battles.find({}, {name:1, year:1});
	q.exec(function(err, ls){ out.send(ls); });
	*/

	// nelabai veikia ..
	// Select * from games where battle_number >= 2 OR battle_number <= 10;
	/*
	var q = Battles.find({
		"$or": [{ "battle_number": {$gte:2}}, { "battle_number": {$lte:4}}]
	});
	q.exec(function(err, ls){ out.send(ls); });
	*/
	// veikia ---
	/*
	var q = Battles.find(  { $or : [  { battle_number : 1 }, { battle_number : 2 } ] }  );
	q.exec(function(err, ls){ out.send(ls); });
	*/
	// neveikė, nes duomenu bazeje tipas buvo String vietoj Number ... dab veikia :)
	/*
	var q = Battles.find(  
		{ $and : [  {  battle_number : { '$gte' : 10 } }, {  battle_number : { '$lte' : 11 } } ] }  
	);
	q.exec(function(err, ls){ out.send(ls); });
	*/

	/*
	var q = Battles.aggregate([{ $avg: 'battle_number' }]);
	q.exec(function(err, ls){ out.send(ls); });
	*/


	// Veikia super!suranda visus max min avg...
	/*
	Battles.aggregate([{ "$group": {
           "_id": 0,
           maximum: {$max: "$defender_size"},
           average: {$avg: "$defender_size"},
           minimum: {$min: "$defender_size"}
       }}]
		,function(err, ls){ 
		out.send(ls); });
		*/

	/*
	// veikia
	Battles.aggregate([{ "$match": {
           //battle_number: {'$lte': 2} /pvz
           defender_king: "Robb Stark"
       }},
       {$group: { _id:0, count: {$sum: 1}}}]
		,function(err, ls){ 
		out.send(ls); });
		*/

	// Veikia ...
	/*
	Battles.aggregate([
		{ 
			$group: {
         		_id:0, uniqueValues: {$addToSet: '$attacker_outcome'}
       		}
       	}
   ]
		,function(err, ls){ 
		out.send(ls); });
	*/
	//
	/*
	Battles.aggregate([
		{ 
			
			$group: {
         		_id: "$attacker_king", count: {$sum: 1}
       		}
       		*/
       		/*
			$group: {
         		_id: "$region", count: {$sum: 1}
       		}
       		*/
       		/*
       		$group: {
         		_id: "$defender_king", count: {$sum: 1}
       		}
       		
       		$group: {
       			_id : "$attacker_outcome",
       			countOfIt: {$sum: 1}
       		}
       	}
   ]
		,function(err, ls){ 
		out.send(ls); });
	*/
}

/* veikia sita !
function testFunction(inp, out) {
	mongoose.model('battles').find(
		function (er, names) {
			out.send(names);
		}
	);
}
*/

app.get('/aKing', function(inp, out)
		{			
			Battles.find({},{_id:0,attacker_king:1},
			function(err, list)
			{
				if (err) return nxt(err);		
				out.send(list);
			});
		}
	);

// ----------------------------------------------------------------
// app.set('env','master'); // testavimas ar galima keisti
// ----------------------------------------------------------------
app.get('/env', function(inp, out){			
			out.send(app.get('env'));
		}
	);
// ----------------------------------------------------------------


// pavizdys kaip is eiluciu listo istraukti unique pagal tam tikra stulpeli
// unique battle types
app.get('/unique', function(inp, out)
		{			
			Battles.find().distinct('battle_type', function(error, list) {
    			
    			out.send(list); // ids is an array of all ObjectIds
			});
		}
	);


/*
// -------------------------------------------------------
// veikiantis examplas
// -------------------------------------------------------
Async.series([
		open,
		get
	]
	, function(err){mongoose.disconnect(); console.log('All done.'); });


function open(callback) {
	console.log('Opening ...');
	mongoose.connection.on('open', callback);
}

function get(callback) {
	FishersObj.find({},
		function(err, list)
		{
			console.log(list);
			callback();	
		});
}
*/


/*
var rek = new Rek(
	{ longitude: "102", 
	latitude: "103", 
	comment: "Labas pagavau cia zuvi.",
	fishName: "Saspi",
	fishImage: "http://www.fishbase.org/images/thumbnails/jpg/tn_Saspi_u0.jpg"
});
*/
/*
rek.save(function(err, user, affected){
	console.log(arguments);
});
*/

/*
mongoose.connection.on('open',function(){
	FishersObj.find({"longitude": "123456"},
		function(err, list)
		{
			console.log(list);	
			mongoose.disconnect();		
		});
});
*/


