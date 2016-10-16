'use strict';

var path = require('path');

module.exports = function(server) {
  require(path.join(__dirname, './models/wine.js'));
  require(path.join(__dirname, './routes/wine.js'))(server);
};
