const mongoose = require('mongoose');
mongoose.connect('mongodb://akis:abcabc@ds113200.mlab.com:13200/octopus');
module.exports = mongoose;