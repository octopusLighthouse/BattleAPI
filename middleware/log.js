/**
* Description: Task
* Author: Robertas Bauras
* Create date: 2018.05.02
* Modify date: 2018.05.21
*/

// http logger middleware
function httpLog(req, res, next){
	console.log(new Date(), req.method, req.url);
	next();
}

// export
module.exports.log = httpLog;