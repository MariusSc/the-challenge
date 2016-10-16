'use strict';

require('should');

var request = require('request');

function itShouldRespondAnErrorWhenPropertyIsNotValid(options, property, value, message, wine) {
  it('should respond with status Code 400 and a validation error ' +
    'when property \'' + property + '\' ' + message,
    function(done) {
      options.body = wine;
      request(options, function(error, response, body) {
        response.statusCode.should.be.exactly(400);
        body.should.have.a.property('error', 'VALIDATION_ERROR');
        body.should.have.a.property('validation');
        body.validation.should.have.a.property(property, value);
        done();
      });
    });
}

function itShouldRespondAnErrorWhenNamePropertyIsInvalid(options) {
  var property = 'name';

  itShouldRespondAnErrorWhenPropertyIsNotValid(options, property, 'MISSING', 'is missing', {
    year: '2013',
    country: 'France',
    type: 'red',
    description: 'The Sean Connery of red wines'
  });

  itShouldRespondAnErrorWhenPropertyIsNotValid(options, property, 'INVALID', 'is null', {
    name: null,
    year: '2013',
    country: 'France',
    type: 'red',
    description: 'The Sean Connery of red wines'
  });

  itShouldRespondAnErrorWhenPropertyIsNotValid(options, property, 'INVALID', 'is empty string', {
    name: '',
    year: '2013',
    country: 'France',
    type: 'red',
    description: 'The Sean Connery of red wines'
  });

  itShouldRespondAnErrorWhenPropertyIsNotValid(options, property, 'INVALID', 'contains spaces', {
    name: '  ',
    year: '2013',
    country: 'France',
    type: 'red',
    description: 'The Sean Connery of red wines'
  });
}

function itShouldRespondAnErrorWhenCountryPropertyIsInvalid(options) {
  var property = 'country';

  itShouldRespondAnErrorWhenPropertyIsNotValid(options, property, 'MISSING', 'is missing', {
    name: 'Cabernet sauvignon',
    year: '2013',
    type: 'red',
    description: 'The Sean Connery of red wines'
  });

  itShouldRespondAnErrorWhenPropertyIsNotValid(options, property, 'INVALID', 'is null', {
    name: 'Cabernet sauvignon',
    year: '2013',
    country: null,
    type: 'red',
    description: 'The Sean Connery of red wines'
  });

  itShouldRespondAnErrorWhenPropertyIsNotValid(options, property, 'INVALID', 'is empty string', {
    name: 'Cabernet sauvignon',
    year: '2013',
    country: '',
    type: 'red',
    description: 'The Sean Connery of red wines'
  });

  itShouldRespondAnErrorWhenPropertyIsNotValid(options, property, 'INVALID', 'contains spaces', {
    name: 'Cabernet sauvignon',
    year: '2013',
    country: '  ',
    type: 'red',
    description: 'The Sean Connery of red wines'
  });
}

function itShouldRespondAnErrorWhenYearPropertyIsInvalid(options) {
  itShouldRespondAnErrorWhenPropertyIsNotValid(options, 'year', 'MISSING', 'is missing', {
    name: 'Cabernet sauvignon',
    country: 'France',
    type: 'red',
    description: 'The Sean Connery of red wines'
  });

  itShouldRespondAnErrorWhenPropertyIsNotValid(options, 'year', 'INVALID', 'is null', {
    name: 'Cabernet sauvignon',
    year: null,
    country: 'France',
    type: 'red',
    description: 'The Sean Connery of red wines'
  });

  itShouldRespondAnErrorWhenPropertyIsNotValid(options, 'year', 'INVALID', 'is less than zero', {
    name: 'Cabernet sauvignon',
    year: -1,
    country: 'France',
    type: 'red',
    description: 'The Sean Connery of red wines'
  });

  itShouldRespondAnErrorWhenPropertyIsNotValid(options, 'year', 'INVALID', 'is a string not a number', {
    name: 'Cabernet sauvignon',
    year: 'this is not a number',
    country: 'France',
    type: 'red',
    description: 'The Sean Connery of red wines'
  });

  itShouldRespondAnErrorWhenPropertyIsNotValid(options, 'year', 'INVALID', 'is a valid number but of type string', {
    name: 'Cabernet sauvignon',
    year: '2016',
    country: 'France',
    type: 'red',
    description: 'The Sean Connery of red wines'
  });

  itShouldRespondAnErrorWhenPropertyIsNotValid(options, 'year', 'INVALID', 'is a number with decimal digits', {
    name: 'Cabernet sauvignon',
    year: 20.1,
    country: 'France',
    type: 'red',
    description: 'The Sean Connery of red wines'
  });
}

function itShouldRespondAnErrorWhenTypePropertyIsInvalid(options) {
  itShouldRespondAnErrorWhenPropertyIsNotValid(options, 'type', 'MISSING', 'is missing', {
    name: 'Cabernet sauvignon',
    year: 2013,
    country: 'France',
    description: 'The Sean Connery of red wines'
  });

  itShouldRespondAnErrorWhenPropertyIsNotValid(options, 'type', 'INVALID', 'is not a string containing either red, white or rose', {
    name: 'Cabernet sauvignon',
    year: 2013,
    country: 'France',
    type: 'some test value',
    description: 'The Sean Connery of red wines'
  });
}

function itShouldRespondStatusOKWhenTypePropertyIsValid(options) {
  var validWineObject = {
    name: 'Cabernet sauvignon',
    year: 2013,
    country: 'France',
    type: 'red',
    description: 'The Sean Connery of red wines'
  };

  it('should respond with a status code of 200 when type is \'red\'', function(done) {
    validWineObject.type = 'red';
    options.body = validWineObject;
    request(options, function(error, response, body) {
      response.statusCode.should.be.exactly(200);
      done();
    });
  });

  it('should respond with a status code of 200 when type is \'rose\'', function(done) {
    validWineObject.type = 'rose';
    options.body = validWineObject;
    request(options, function(error, response, body) {
      response.statusCode.should.be.exactly(200);
      done();
    });
  });

  it('should respond with a status code of 200 when type is \'white\'', function(done) {
    validWineObject.type = 'white';
    options.body = validWineObject;
    request(options, function(error, response, body) {
      response.statusCode.should.be.exactly(200);
      done();
    });
  });
}

module.exports.itShouldRespondStatusOKWhenTypePropertyIsValid = itShouldRespondStatusOKWhenTypePropertyIsValid;
module.exports.itShouldRespondAnErrorWhenTypePropertyIsInvalid = itShouldRespondAnErrorWhenTypePropertyIsInvalid;
module.exports.itShouldRespondAnErrorWhenYearPropertyIsInvalid = itShouldRespondAnErrorWhenYearPropertyIsInvalid;
module.exports.itShouldRespondAnErrorWhenCountryPropertyIsInvalid = itShouldRespondAnErrorWhenCountryPropertyIsInvalid;
module.exports.itShouldRespondAnErrorWhenNamePropertyIsInvalid = itShouldRespondAnErrorWhenNamePropertyIsInvalid;
module.exports.itShouldRespondStatusOKWhenTypePropertyIsValid = itShouldRespondStatusOKWhenTypePropertyIsValid;
