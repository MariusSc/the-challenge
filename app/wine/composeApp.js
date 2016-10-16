'use strict';

var path = require('path');

module.exports = function(server) {
  require(path.join(__dirname, './models/wineModel'));
  require(path.join(__dirname, './routes/wineRoutes'))(server);
};
