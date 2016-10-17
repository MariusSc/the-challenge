'use strict';

var path = require('path');

require(path.join(__dirname, './helpers/startServer'));
require('should');

var async = require('async');
var request = require('request');
var config = require('../../../config/config');
var baseUrl = ''.concat('http://', config.app.address, ':', config.app.port);
var mongodbHelpers = require(path.join(__dirname, './helpers/mongodb'));
var wineRepository = require(path.join(__dirname, '../repository/wineRepository'));

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

        wineRepository.find({id: wineIdOfTheInsertedWineObject}, function(error, wines) {
          wines.should.have.a.property('length', 0);
          done();
        });
      });
    });

    it('should respond with status code 400 and an error message when wine object not found', function(done) {
      var options2 = {
        url: baseUrl + '/wines/-1',
        body: wineObject,
        method: 'DELETE',
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
