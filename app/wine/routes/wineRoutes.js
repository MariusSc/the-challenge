'use strict';
var path = require('path');
var wineRepository = require(path.join(__dirname, '../repository/wineRepository'));

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

function sendResponse(res, statusCode, body) {
  res.charSet('utf-8');
  sendResponse(res, statusCode, body);
}

module.exports = function(server) {
  server.get({path: PATH, version: VERSION}, findDocuments);
  server.get({path: PATH + '/:id', version: VERSION}, findOneDocument);
  server.post({path: PATH, version: VERSION}, createDocument);
  server.put({path: PATH + '/:id', version: VERSION}, updateDocument);
  server.del({path: PATH + '/:id', version: VERSION}, deleteDocument);

  function findDocuments(req, res, next) {
    wineRepository.find(req.params, function(error, wines) {
      if (error) {
        sendResponse(res, 400, {error: 'UNKNOWN_OBJECT'});
        return next(error);
      }

      var wineArray = [];
      wines.forEach(function(wine, index, array) {
        wineArray.push(createResponseBody(wine));
      });

      sendResponse(res, 200, wineArray);
      return next();
    });
  }

  function findOneDocument(req, res, next) {
    var query = {id: req.params.id};
    wineRepository.find(query, function(error, wines) {
      if (error) {
        sendResponse(res, 400, {error: 'UNKNOWN_OBJECT'});
        return next(error);
      }
      if (wines.length <= 0) {
        sendResponse(res, 400, {error: 'UNKNOWN_OBJECT'});
        return next();
      }

      sendResponse(res, 200, createResponseBody(wines[0]));
      return next();
    });
  }

  function createDocument(req, res, next) {
    wineRepository.add(req.body, function(error, createdWineObject) {
      if (error) {
        sendResponse(res, 400, error);
        return next();
      }
      sendResponse(res, 200, createResponseBody(createdWineObject));
      return next();
    });
  }

  function updateDocument(req, res, next) {
    wineRepository.update(req.params.id, req.body, function(error, updatedWineObject) {
      if (error) {
        sendResponse(res, 400, error);
        return next();
      }
      sendResponse(res, 200, createResponseBody(updatedWineObject));
      return next();
    });
  }

  function deleteDocument(req, res, next) {
    wineRepository.delete(req.params.id, function(error) {
      if (error) {
        sendResponse(res, 400, {error: 'UNKNOWN_OBJECT'});
        return next();
      }

      sendResponse(res, 200, {success: true});
      return next();
    });
  }
};
