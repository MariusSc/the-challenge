'use strict';
var mongoose = require('mongoose');
var Wine = mongoose.model('Wine');

module.exports = function(wineId, next) {
  var conditions = {id: wineId};

  Wine.findOne(conditions, 'id', function(error, wine) {
    if (error) {
      return next(error);
    }

    if (!wine) {
      return next({error: 'UNKNOWN_OBJECT'});
    }

    Wine.remove(conditions, function(error) {
      if (error) {
        return next(error);
      }

      return next();
    });
  });
};
