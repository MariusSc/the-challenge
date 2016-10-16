'use strict';

var path = require('path');
var async = require('async');

require(path.join(__dirname, '../app'));
require('should');

var request = require('request');

var config = require(path.join(__dirname, '../config/config'));
var baseUrl = ''.concat('http://', config.app.address, ':', config.app.port);


var mongodbHelpers = require(path.join(__dirname, './mongodbTestHelpers'));

var wineIdOfTheInsertedWineObject = 0;
var options = {};

var wineObject = {
  name: 'Cabernet sauvignon',
  year: 2013,
  country: 'France',
  type: 'red',
  description: 'The Sean Connery of red wines'
};

describe('Run tests on Wine API', function() {
  describe('DELETE /wines/:id', function() {
    beforeEach(function(done) {
      async.series([
        function(callback) {
          mongodbHelpers.removeWines(callback, {});
        },
        function(callback) {
          var wine = new mongodbHelpers.WineModel()({
            name: 'Cabernet sauvignon',
            year: 2013,
            country: 'France',
            type: 'red',
            description: 'The Sean Connery of red wines'
          });

          mongodbHelpers.saveWine(function() {
            wineIdOfTheInsertedWineObject = wine.id;
            callback();
          }, wine);
        }], function(error) {
        if (error) {
          throw error;
        }

        options = {
          url: baseUrl + '/wines/' + wineIdOfTheInsertedWineObject,
          method: 'DELETE',
          headers: {
            accept: 'application/json'
          },
          json: true,
          body: wineObject
        };

        done();
      });
    });

    afterEach(function(done) {
      mongodbHelpers.removeWines(done, {});
    });

    it('should respond with a status code of 200 and a success message', function(done) {
      request(options, function(error, response, body) {
        response.statusCode.should.be.exactly(200);
        body.should.have.a.property('success', true);
        done();
      });
    });

    it('should respond with status code 400 and an error message when wine object not found', function(done) {
      var options2 = {
        url: baseUrl + '/wines/0',
        body: wineObject,
        method: 'PUT',
        headers: {
          accept: 'application/json'
        },
        json: true
      };

      request(options2, function(error, response, body) {
        response.statusCode.should.be.exactly(400);
        body.should.have.a.property('error', 'UNKNOWN_OBJECT');
        done();
      });
    });
  });
});


