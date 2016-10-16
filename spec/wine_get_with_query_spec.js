'use strict';

var path = require('path');

require(path.join(__dirname, '../app'));

var request = require('request');

require('should');
var async = require("async");

var config = require(path.join(__dirname, '../config/config'));
var baseUrl = ''.concat('http://', config.app.address, ':', config.app.port);
var url = baseUrl + '/wines';
var requestOptions = {};

var mongodbHelpers = require(path.join(__dirname, './mongodbTestHelpers'));

describe('Run tests on Wine API', function() {
  describe('GET /wines', function() {
    beforeEach(function(done) {
      async.series([
        function(callback) {
          mongodbHelpers.removeWines(callback, {});
        },
        function(callback) {
          mongodbHelpers.saveWine(callback, new mongodbHelpers.WineModel()({
            name: 'Cabernet sauvignon',
            year: 2010,
            country: 'France',
            type: 'red',
            description: 'Similar to merlot'
          }));
        },
        function(callback) {
          mongodbHelpers.saveWine(callback, new mongodbHelpers.WineModel()({
            name: 'Barbera',
            year: 2010,
            country: 'Italy',
            type: 'red',
            description: 'Similar to Mueller-Thurgau'
          }));
        },
        function(callback) {
          mongodbHelpers.saveWine(callback, new mongodbHelpers.WineModel()({
            name: 'Grenache, Syrah, Cinsault',
            year: 2015,
            country: 'France',
            type: 'rose',
            description: 'Tasts fresh, fruity and creamy'
          }));
        },
        function(callback) {
          mongodbHelpers.saveWine(callback, new mongodbHelpers.WineModel()({
            name: 'Grauburgunder',
            year: 2011,
            country: 'Germany',
            type: 'white',
            description: 'Dry and crisp wine'
          }));
        }], function(error) {
        if (error) {
          throw error;
        }

        requestOptions = {
          method: 'GET',
          url: url,
          headers: {
            accept: 'application/json'
          }
        };

        done();
      });
    });

    afterEach(function(done) {
      mongodbHelpers.removeWines(done, {});
    });

    it('should respond with a status code of 200', function(done) {
      request(requestOptions, function(error, response, body) {
        response.statusCode.should.be.exactly(200);
        done();
      });
    });

    it('should respond with exactly 4 wine objects', function(done) {
      request(requestOptions, function(error, response, body) {
        var wines = JSON.parse(body);
        wines.should.be.an.instanceof(Array);
        wines.should.have.a.property('length', 4);
        done();
      });
    });

    it('should respond with exactly 4 wine objects ordered by id async', function(done) {
      request(requestOptions, function(error, response, body) {
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
        request(requestOptions, function(error, response, body) {
          var wines = JSON.parse(body);
          var wine = wines[0];
          wine.should.have.a.property('id');
          wine.should.have.a.property('name', 'Cabernet sauvignon');
          wine.should.have.a.property('year', 2010);
          wine.should.have.a.property('country', 'France');
          wine.should.have.a.property('type', 'red');
          wine.should.have.a.property('description', 'Similar to merlot');

          Object.keys(wine).should.have.length(6);
          wine.id.should.be.greaterThan(0);
          done();
        });
      });

    it('should respond with one wine object when year is limited to 2015',
      function(done) {
        var queryRequestOptions = {url: url + '?year=2015', method: 'GET', headers: {accept: 'application/json'}};
        request(queryRequestOptions, function(error, response, body) {
          var wines = JSON.parse(body);
          Object.keys(wines).should.have.length(1);
          var wine = wines[0];
          wine.should.have.a.property('year', 2015);
          done();
        });
      });
    it('should respond with one wine object when country is limited to Germany',
      function(done) {
        var queryRequestOptions = {url: url + '?country=Germany', method: 'GET', headers: {accept: 'application/json'}};
        request(queryRequestOptions, function(error, response, body) {
          var wines = JSON.parse(body);
          Object.keys(wines).should.have.length(1);
          var wine = wines[0];
          wine.should.have.a.property('country', 'Germany');
          done();
        });
      });
    it('should respond with one wine object when type is limited to rose',
      function(done) {
        var queryRequestOptions = {url: url + '?type=rose', method: 'GET', headers: {accept: 'application/json'}};
        request(queryRequestOptions, function(error, response, body) {
          var wines = JSON.parse(body);
          Object.keys(wines).should.have.length(1);
          var wine = wines[0];
          wine.should.have.a.property('type', 'rose');
          done();
        });
      });
    it('should respond with one wine object when name is limited to Barbera',
      function(done) {
        var queryRequestOptions = {url: url + '?name=Barbera', method: 'GET', headers: {accept: 'application/json'}};
        request(queryRequestOptions, function(error, response, body) {
          var wines = JSON.parse(body);
          Object.keys(wines).should.have.length(1);
          var wine = wines[0];
          wine.should.have.a.property('name', 'Barbera');
          done();
        });
      });
    it('should respond with two wine objects when type is red and year is 2010',
      function(done) {
        var queryRequestOptions = {url: url + '?year=2010&type=red', method: 'GET', headers: {accept: 'application/json'}};
        request(queryRequestOptions, function(error, response, body) {
          var wines = JSON.parse(body);
          Object.keys(wines).should.have.length(2);
          var wine = wines[0];
          wine.should.have.a.property('type', 'red');
          wine.should.have.a.property('year', 2010);
          wine = wines[1];
          wine.should.have.a.property('type', 'red');
          wine.should.have.a.property('year', 2010);
          done();
        });
      });
    it('should respond with one wine objects when type is red, year is 2010, name is Barbera and country is Italy',
      function(done) {
        var queryRequestOptions = {url: url + '?year=2010&type=red&country=Italy&name=Barbera', method: 'GET', headers: {accept: 'application/json'}};
        request(queryRequestOptions, function(error, response, body) {
          var wines = JSON.parse(body);
          Object.keys(wines).should.have.length(1);
          var wine = wines[0];
          wine.should.have.a.property('type', 'red');
          wine.should.have.a.property('year', 2010);
          wine.should.have.a.property('country', 'Italy');
          wine.should.have.a.property('name', 'Barbera');
          done();
        });
      });
  });
});
