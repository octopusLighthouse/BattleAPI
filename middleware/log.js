/**
* Description: Task
* Author: Robertas Bauras
* Create date: 2018.05.02
* Modify date: 2018.05.21
*/
function httpLog(req, res, next){
	console.log(new Date(), req.method, req.url);
	next();
}
module.exports.log = httpLog;