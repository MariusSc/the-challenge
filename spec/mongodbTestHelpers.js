'use strict';

function removeWines(callback, options) {
  var path = require('path');
  var mongoose = require('mongoose');
  require(path.join(__dirname, '../app/models'));
  var Wine = mongoose.model('Wine');

  var log = require(path.join(__dirname, '../log'));

  Wine.remove(options, function(error) {
    if (error) {
      log.error(error);
    }
    callback();
  });
}

function saveWine(callback, wine) {
  var path = require('path');
  var log = require(path.join(__dirname, '../log'));

  wine.save(function(error, wineSaved) {
    if (error) {
      log.error(error);
    }
    wine.id = wineSaved.id;
    callback();
  });
}

function WineModel() {
  var mongoose = require('mongoose');
  var wine = mongoose.model('Wine');
  return wine;
}

module.exports.saveWine = saveWine;
module.exports.removeWines = removeWines;
module.exports.WineModel = WineModel;
