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
  describe('GET /wines/:id', function() {
    beforeEach(function(done) {
      async.series([
        function(callback) {
          mongodbHelpers.removeWines(callback, {});
        },
        function(callback) {
          mongodbHelpers.saveWine(callback, new mongodbHelpers.WineModel()({
            id: 1,
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

    var url1 = baseUrl + '/wines/1';

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

    it('should respond with exactly one wine object', function(done) {
      request(options1, function(error, response, body) {
        var wine = JSON.parse(body);
        wine.should.be.an.instanceof(Object);
        done();
      });
    });

    it('should respond with all properties of \'Cabernet sauvignon\' object',
      function(done) {
        request(options1, function(error, response, body) {
          var wine = JSON.parse(body);
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

    var url2 = baseUrl + '/wines/1234567';

    var options2 = {
      method: 'GET',
      url: url2,
      headers: {
        accept: 'application/json'
      }
    };

    it('should respond with status code of 400 when the \'id\' is not found',
      function(done) {
        request(options2, function(error, response, body) {
          response.statusCode.should.be.exactly(400);
          done();
        });
      });

    it('should respond with \'error: UNKNOWN_OBJECT\' ' +
       'when the \'id\' is not found',
      function(done) {
        request(options2, function(error, response, body) {
          var wine = JSON.parse(body);
          wine.should.have.a.property('error', 'UNKNOWN_OBJECT');
          done();
        });
      });
  });
});
