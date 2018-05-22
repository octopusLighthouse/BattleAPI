/**
* Description: Task
* Author: Robertas Bauras
* Create date: 2018.05.02
* Modify date: 2018.05.16
*/

/**
* https://enigmatic-chamber-75142.herokuapp.com/ | https://git.heroku.com/enigmatic-chamber-75142.git
* …or push an existing repository from the command line
* git remote add origin https://github.com/octopusLighthouse/home.git
* git push -u origin master
* octopusLighthouse
*/

// includes
let express = require('express');
let debug = require('./routes/debug');
let List = require('./routes/list');
let Count = require('./routes/count');
let Status = require('./routes/status');
let Search = require('./routes/search');
let config = require('./config/index.js');
let battleServerHttp = require('./middleware/log');
let Login = require('./middleware/login');
let favicon = require('serve-favicon');
let path = require('path');
let app = express();
//mongoose.set('debug', true);

// server port
app.set('port', process.env.PORT || config.get('port'));

// Middleware
app.use(battleServerHttp.log);
app.use(favicon(path.join(__dirname, 'images', 'favicon.ico')));

// release routes
app.get('/list', Login.userAuthentification, List.list);
app.get('/count', Login.userAuthentification, Count.count);
app.get('/stats', Login.userAuthentification, Status.status);
app.get('/search', Login.userAuthentification, Search.search);

// debug routes
app.get('/all', debug.all);
app.get('/test', debug.test);
//app.get('/midware', debug.mid1, debug.mid2, debug.mid3);

// Error mid-ware
app.use(debug.error);

// hook up server on port
app.listen(app.get('port'));





