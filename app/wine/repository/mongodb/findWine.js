'use strict';
var mongoose = require('mongoose');
var Wine = mongoose.model('Wine');

module.exports = function(query, next) {
  var conditions = {};
  var projection = {};
  var options = {};

  if (query.id) {
    conditions.id = query.id;
  }

  if (query.year) {
    conditions.year = query.year;
  }

  if (query.name) {
    conditions.name = query.name;
  }

  if (query.type) {
    conditions.type = query.type;
  }

  if (query.country) {
    conditions.country = query.country;
  }

  Wine
    .find(conditions, projection, options)
    .sort({id: 1}).exec(function(error, wines) {
      if (error) {
        return next(error);
      }

      return next(null, wines);
    });
};
