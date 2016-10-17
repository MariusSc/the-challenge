'use strict';

var path = require('path');

module.exports = function(server) {
  require(path.join(__dirname, './repository/mongodb/wineModel'));
  require(path.join(__dirname, './routes/wineRoutes'))(server);

  var wineRepository = require(path.join(__dirname, './repository/wineRepository'));
  var addWine = require(path.join(__dirname, './repository/mongodb/addWine'));
  wineRepository.addInternal = addWine;

  var updateWine = require(path.join(__dirname, './repository/mongodb/updateWine'));
  wineRepository.updateInternal = updateWine;

  var deleteWine = require(path.join(__dirname, './repository/mongodb/deleteWine'));
  wineRepository.deleteInternal = deleteWine;

  var findWine = require(path.join(__dirname, './repository/mongodb/findWine'));
  wineRepository.findInternal = findWine;
};
