'use strict';

var path = require('path');

require(path.join(__dirname, './startServer'));
require('should');

var request = require('request');
var config = require('../../../config/config');
var baseUrl = ''.concat('http://', config.app.address, ':', config.app.port);
var mongodbHelpers = require(path.join(__dirname, './mongodbTestHelpers'));
var wineTestHelpers = require(path.join(__dirname, './wineTestHelpers'));

describe('Run tests on Wine API', function() {
  describe('POST /wines', function() {
    beforeEach(function(done) {
      mongodbHelpers.removeWines(done, {});
    });
    afterEach(function(done) {
      mongodbHelpers.removeWines(done, {});
    });

    var url = baseUrl + '/wines';

    var options = {
      method: 'POST',
      url: url,
      headers: {
        accept: 'application/json'
      },
      json: true
    };

    var validWineObject = {
      name: 'Cabernet sauvignon',
      year: 2013,
      country: 'France',
      type: 'red',
      description: 'The Sean Connery of red wines'
    };

    it('should respond with a status code of 200', function(done) {
      options.body = validWineObject;
      request(options, function(error, response, body) {
        response.statusCode.should.be.exactly(200);
        done();
      });
    });

    it('should respond with exactly (1) wine object', function(done) {
      options.body = validWineObject;
      request(options, function(error, response, body) {
        body.should.be.an.instanceof(Object);
        done();
      });
    });

    it('should respond all and only the values of \'Cabernet sauvignon\' object',
      function(done) {
        options.body = validWineObject;
        request(options, function(error, response, body) {
          var wine = body;
          wine.should.have.a.property('id');
          wine.should.have.a.property('name', 'Cabernet sauvignon');
          wine.should.have.a.property('year', 2013);
          wine.should.have.a.property('country', 'France');
          wine.should.have.a.property('type', 'red');
          wine.should.have.a.property('description', 'The Sean Connery of red wines');

          Object.keys(wine).should.have.length(6);
          wine.id.should.be.greaterThan(0);

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
