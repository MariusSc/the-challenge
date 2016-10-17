'use strict';
var mongoose = require('mongoose');
var Wine = mongoose.model('Wine');

module.exports = function(wine, next) {
  var wineModel = new Wine({
    name: wine.name,
    year: wine.year,
    country: wine.country,
    type: wine.type,
    description: wine.description
  });

  wineModel.save(function(error, createdWineModel, numAffected) {
    if (error) {
      return next(error);
    }

    return next(null, createdWineModel);
  });
};
