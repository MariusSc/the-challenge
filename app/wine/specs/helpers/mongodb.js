'use strict';

var path = require('path');
var log = require(path.join(__dirname, '../../../../log'));
var mongoose = require('mongoose');
var Wine = mongoose.model('Wine');

function removeWines(callback, options) {
  Wine.remove(options, function(error) {
    if (error) {
      log.error(error);
    }
    callback();
  });
}

function saveWine(callback, wine) {
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
