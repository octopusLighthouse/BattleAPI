// --------------------------------------------------------------------------------------------
// Description: Task
// Author: Robertas Bauras
// Create date: 2018.05.02
// Modify date: 2018.05.16
// --------------------------------------------------------------------------------------------
// https://enigmatic-chamber-75142.herokuapp.com/ | https://git.heroku.com/enigmatic-chamber-75142.git
// …or push an existing repository from the command line
// git remote add origin https://github.com/octopusLighthouse/home.git
// git push -u origin master
// octopusLighthouse
// --------------------------------------------------------------------------------------------
// includes
// --------------------------------------------------------------------------------------------
var express = require('express');
var routes = require('./routes/routes');
var List = require('./routes/list');
var Count = require('./routes/count');
var Status = require('./routes/status');
var Search = require('./routes/search');
var config = require('./config/index.js');
var battleServerHttp = require('./middleware/log');
var Login = require('./middleware/login');
var favicon = require('serve-favicon');
var path = require('path');
var app = express();
//mongoose.set('debug', true);
// --------------------------------------------------------------------------------------------
// server port
// --------------------------------------------------------------------------------------------
app.set('port', process.env.PORT || config.get('port'));
// --------------------------------------------------------------------------------------------
// Middlewere
// --------------------------------------------------------------------------------------------
app.use(battleServerHttp.log);
app.use(favicon(path.join(__dirname, 'images', 'favicon.ico')));
// --------------------------------------------------------------------------------------------
// release routes
// --------------------------------------------------------------------------------------------
app.get('/list', Login.userAuthentification, List.list);
app.get('/count', Login.userAuthentification, Count.count);
app.get('/stats', Login.userAuthentification, Status.status);
app.get('/search', Login.userAuthentification, Search.search);
// --------------------------------------------------------------------------------------------
// debug routes
// --------------------------------------------------------------------------------------------
//app.get('/...', routes.all);
//app.get('/test', routes.test);
//app.get('/midware', routes.mid1, routes.mid2, routes.mid3);
// --------------------------------------------------------------------------------------------
// Error mid-ware
// --------------------------------------------------------------------------------------------
app.use(routes.error);
// --------------------------------------------------------------------------------------------
// hook up server on port
// --------------------------------------------------------------------------------------------
app.listen(app.get('port'));
// --------------------------------------------------------------------------------------------
// End of file
// --------------------------------------------------------------------------------------------


