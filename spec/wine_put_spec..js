'use strict';

var path = require('path');
var async = require('async');

require(path.join(__dirname, '../app'));
require('should');

var request = require('request');

var config = require(path.join(__dirname, '../config/config'));
var baseUrl = ''.concat('http://', config.app.address, ':', config.app.port);


var mongodbHelpers = require(path.join(__dirname, './mongodbTestHelpers'));
var wineTestHelpers = require(path.join(__dirname, './wineTestHelpers'));

var wineIdOfTheInsertedWineObject = 0;

var wineObject = {
  name: 'Cabernet sauvignon',
  year: 2013,
  country: 'France',
  type: 'red',
  description: 'The Sean Connery of red wines'
};

var options = {
  method: 'PUT',
  headers: {
    accept: 'application/json'
  },
  json: true,
  body: wineObject
};

describe('Run tests on Wine API', function() {
  describe('PUT /wines', function() {
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

        options.url = baseUrl + '/wines/' + wineIdOfTheInsertedWineObject;

        done();
      });
    });

    afterEach(function(done) {
      mongodbHelpers.removeWines(done, {});
    });

    it('should respond with a status code of 200', function(done) {
      request(options, function(error, response, body) {
        response.statusCode.should.be.exactly(200);
        done();
      });
    });

    it('should respond with exactly (1) wine object', function(done) {
      request(options, function(error, response, body) {
        body.should.be.an.instanceof(Object);
        done();
      });
    });

    it('should respond all and only the values of \'Cabernet sauvignon\' object',
      function(done) {
        request(options, function(error, response, body) {
          var wine = body;
          wine.should.have.a.property('id', wineIdOfTheInsertedWineObject);
          wine.should.have.a.property('name', 'Cabernet sauvignon');
          wine.should.have.a.property('year', 2013);
          wine.should.have.a.property('country', 'France');
          wine.should.have.a.property('type', 'red');
          wine.should.have.a.property('description', 'The Sean Connery of red wines');

          Object.keys(wine).should.have.length(6);
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

    wineTestHelpers.itShouldRespondAnErrorWhenNamePropertyIsInvalid(options);
    wineTestHelpers.itShouldRespondAnErrorWhenCountryPropertyIsInvalid(options);
    wineTestHelpers.itShouldRespondAnErrorWhenYearPropertyIsInvalid(options);
    wineTestHelpers.itShouldRespondStatusOKWhenTypePropertyIsValid(options);
    wineTestHelpers.itShouldRespondAnErrorWhenTypePropertyIsInvalid(options);
  });
});


