/**
* Description: Task
* Author: Robertas Bauras
* Create date: 2018.05.02
* Modify date: 2018.05.21
*/
const mongoose = require('mongoose');
mongoose.connect('mongodb://playerX:Vilnius_1983@ds111390.mlab.com:11390/game');
module.exports = mongoose;