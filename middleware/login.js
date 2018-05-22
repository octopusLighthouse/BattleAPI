/**
* Description: Task
* Author: Robertas Bauras
* Create date: 2018.05.02
* Modify date: 2018.05.21
*/
// In future releases will done :)
let status = { userLoggedIn: true };

function login(input, output, next){
	if (status.userLoggedIn == true){
		next();
	}else{
		output.send({
			"success": false,
			"data": {
			"message": "Session Expired. Please Login again"
			}
		});
	}
}

module.exports.userAuthentification = login;
