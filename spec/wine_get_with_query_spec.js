'use strict';

var path = require('path');

require(path.join(__dirname, '../app'));

var request = require('request');

require('should');
var async = require("async");

var config = require(path.join(__dirname, '../config/config'));
var baseUrl = ''.concat('http://', config.app.address, ':', config.app.port);

var mongodbHelpers = require(path.join(__dirname, './mongodbTestHelpers'));


describe('Run tests on Wine API', function() {
  describe.only('GET /wines', function() {
    beforeEach(function(done) {
      async.series([
        function(callback) {
          mongodbHelpers.removeWines(callback, {});
        },
        function(callback) {
          mongodbHelpers.saveWine(callback, new mongodbHelpers.WineModel()({
            name: 'Cabernet sauvignon',
            year: 2013,
            country: 'France',
            type: 'red',
            description: 'Similar to merlot'
          }));
        },
        function(callback) {
          mongodbHelpers.saveWine(callback, new mongodbHelpers.WineModel()({
            name: 'Cabernet sauvignon',
            year: 2013,
            country: 'France',
            type: 'red',
            description: 'Similar to merlot'
          }));
        },
        function(callback) {
          mongodbHelpers.saveWine(callback, new mongodbHelpers.WineModel()({
            name: 'Cabernet sauvignon',
            year: 2013,
            country: 'France',
            type: 'red',
            description: 'Similar to merlot'
          }));
        },
        function(callback) {
          mongodbHelpers.saveWine(callback, new mongodbHelpers.WineModel()({
            name: 'Cabernet sauvignon',
            year: 2013,
            country: 'France',
            type: 'red',
            description: 'Similar to merlot'
          }));
        }], function(error) {
        if (error) {
          throw error;
        }
        done();
      });
    });

    afterEach(function(done) {
      mongodbHelpers.removeWines(done, {});
    });

    var url1 = baseUrl + '/wines';

    var options1 = {
      method: 'GET',
      url: url1,
      headers: {
        accept: 'application/json'
      }
    };

    it('should respond with a status code of 200', function(done) {
      request(options1, function(error, response, body) {
        response.statusCode.should.be.exactly(200);
        done();
      });
    });

    it('should respond with exactly 4 wine objects', function(done) {
      request(options1, function(error, response, body) {
        var wines = JSON.parse(body);
        wines.should.be.an.instanceof(Array);
        wines.should.have.a.property('length', 4);
        done();
      });
    });

    it('should respond with exactly 4 wine objects ordered by id async', function(done) {
      request(options1, function(error, response, body) {
        var wines = JSON.parse(body);
        var previousId = 0;
        wines.forEach(function(wine, index, array) {
          previousId.should.be.lessThan(wine.id);
          previousId = wine.id;
        });
        done();
      });
    });
    it('should respond with all properties of a wine object',
      function(done) {
        request(options1, function(error, response, body) {
          var wines = JSON.parse(body);
          var wine = wines[0];
          wine.should.have.a.property('id');
          wine.should.have.a.property('name', 'Cabernet sauvignon');
          wine.should.have.a.property('year', 2013);
          wine.should.have.a.property('country', 'France');
          wine.should.have.a.property('type', 'red');
          wine.should.have.a.property('description', 'Similar to merlot');

          Object.keys(wine).should.have.length(6);
          wine.id.should.be.greaterThan(0);
          done();
        });
      });
  });
});
