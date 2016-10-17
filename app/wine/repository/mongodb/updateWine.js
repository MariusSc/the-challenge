'use strict';
var mongoose = require('mongoose');
var Wine = mongoose.model('Wine');

module.exports = function(wineId, wine, next) {
  var wineToSave = {
    name: wine.name,
    year: wine.year,
    country: wine.country,
    type: wine.type,
    description: wine.description
  };

  var conditions = {id: wineId};
  var options = {runValidators: true, upsert: false, new: true};

  Wine.findOneAndUpdate(conditions, wineToSave, options, function(error, wineUpdated) {
    if (error) {
      return next(error);
    }

    if (!wineUpdated) {
      return next({error: 'UNKNOWN_OBJECT'});
    }

    return next(null, wineUpdated);
  });
};
