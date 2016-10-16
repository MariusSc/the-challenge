'use strict';

var mongoose = require('mongoose');
var Wine = mongoose.model('Wine');

var PATH = '/wines';
var VERSION = '1.0.0';

function createResponseBody(wine) {
  return {
    id: wine.id,
    year: wine.year,
    name: wine.name,
    country: wine.country,
    type: wine.type,
    description: wine.description
  };
}

function isEmpty(obj) {
  if (obj === null ||
      (typeof obj === 'undefined') ||
      (typeof obj.valueOf() !== "string") ||
      (obj.trim().length === 0)) {
    return true;
  }
  return false;
}

function isYear(obj) {
  if ((typeof obj === "undefined") ||
      (typeof obj !== "number") ||
      !Number.isInteger(obj) ||
      isNaN(obj) ||
      obj <= 0) {
    return false;
  }
  return true;
}

function validateWineObject(wine) {
  var validationResult = {validation: {}};

  if (!wine.hasOwnProperty("name")) {
    validationResult.validation.name = 'MISSING';
  } else if (isEmpty(wine.name)) {
    validationResult.validation.name = 'INVALID';
  }

  if (!wine.hasOwnProperty("year")) {
    validationResult.validation.year = 'MISSING';
  } else if (!isYear(wine.year)) {
    validationResult.validation.year = 'INVALID';
  }

  if (!wine.hasOwnProperty("country")) {
    validationResult.validation.country = 'MISSING';
  } else if (isEmpty(wine.country)) {
    validationResult.validation.country = 'INVALID';
  }

  // API Improvment: Output a meaningful hint to the API user.
  // var typeHint = 'Valid values are \'red\', \'white\' or \'rose\'';
  if (!wine.hasOwnProperty("type")) {
    validationResult.validation.type = 'MISSING';
  } else if (isEmpty(wine.type)) {
    validationResult.validation.type = 'INVALID';
    // validationResult.validation.typeHint = typeHint;
  } else if (wine.type !== 'red' && wine.type !== 'white' && wine.type !== 'rose') {
    validationResult.validation.type = 'INVALID';
    // validationResult.validation.typeHint = typeHint;
  }

  if (Object.keys(validationResult.validation).length > 0) {
    validationResult.error = 'VALIDATION_ERROR';
    return validationResult;
  }

  return null;
}

module.exports = function(server) {
  server.get({path: PATH, version: VERSION}, findDocuments);
  server.get({path: PATH + '/:id', version: VERSION}, findOneDocument);
  server.post({path: PATH, version: VERSION}, createDocument);
  server.put({path: PATH + '/:id', version: VERSION}, updateDocument);
  server.del({path: PATH + '/:id', version: VERSION}, deleteDocument);

  function findDocuments(req, res, next) {
    var conditions = {};
    var projection = {};
    var options = {};

    if (req.query.year) {
      conditions.year = req.query.year;
    }

    if (req.query.name) {
      conditions.name = req.query.name;
    }

    if (req.query.type) {
      conditions.type = req.query.type;
    }

    if (req.query.country) {
      conditions.country = req.query.country;
    }

    Wine
      .find(conditions, projection, options)
      .sort({id: 1}).exec(function(error, wines) {
        if (error) {
          return next(error);
        }

        var wineArray = [];
        wines.forEach(function(wine, index, array) {
          wineArray.push(createResponseBody(wine));
        });

        res.send(200, wineArray);
        return next();
      });
  }

  function findOneDocument(req, res, next) {
    var conditions = {id: req.params.id};
    var projection = {};
    var options = {};
    Wine.findOne(conditions, projection, options, function(error, wine) {
      if (error) {
        return next(error);
      }

      if (wine === null) {
        res.send(400, {error: 'UNKNOWN_OBJECT'});
        return next();
      }

      res.send(200, createResponseBody(wine));
      return next();
    });
  }

  function createDocument(req, res, next) {
    var validationResult = validateWineObject(req.body);
    if (validationResult) {
      res.send(400, validationResult);
      return next();
    }

    var wine = new Wine({
      name: req.body.name,
      year: req.body.year,
      country: req.body.country,
      type: req.body.type,
      description: req.body.description
    });

    wine.save(function(error, wine, numAffected) {
      if (error) {
        return next(error);
      }

      res.send(200, createResponseBody(wine));
      return next();
    });
  }

  function updateDocument(req, res, next) {
    var validationResult = validateWineObject(req.body);
    if (validationResult) {
      res.send(400, validationResult);
      return next();
    }

    var wineId = req.params.id;

    var wine = {
      name: req.body.name,
      year: req.body.year,
      country: req.body.country,
      type: req.body.type,
      description: req.body.description
    };

    var conditions = {id: wineId};
    var options = {runValidators: true, upsert: false};

    Wine.findOneAndUpdate(conditions, wine, options, function(error, wineUpdated) {
      if (error) {
        return next(error);
      }

      if (!wineUpdated) {
        res.send(400, {error: 'UNKNOWN_OBJECT'});
        return next();
      }

      res.send(200, createResponseBody(wineUpdated));
      return next();
    });
  }

  function deleteDocument(req, res, next) {
    var wineId = req.params.id;
    var conditions = {id: wineId};
    var options = {runValidators: true, upsert: false};

    Wine.findOneAndUpdate(conditions, options, function(error, wineRemoved) {
      if (error) {
        return next(error);
      }

      if (!wineRemoved) {
        res.send(400, {error: 'UNKNOWN_OBJECT'});
        return next();
      }

      res.send(200, {success: true});
      return next();
    });
  }
};
