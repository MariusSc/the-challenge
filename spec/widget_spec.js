'use strict';

var path = require('path');

require(path.join(__dirname, '../app'));

var request = require('request');
var mongoose = require('mongoose');
require('should');
var async = require("async");

var config = require(path.join(__dirname, '../config/config'));
var baseUrl = ''.concat('http://', config.app.address, ':', config.app.port);

// var dbConnection = require(path.join(__dirname, '../db-connection'));
// dbConnection();

// var widget_model = require(path.join(__dirname, '../app/models/widget'));
// widget_model();

var Widget = mongoose.model('Widget');

var log = require(path.join(__dirname, '../log'));

function saveWidget(callback, widget) {
  widget.save(function(error) {
    if (error) {
      log.error(error);
    }
    callback();
  });
}

function removeWidgets(callback, options) {
  Widget.remove(options, function(error) {
    if (error) {
      log.error(error);
    }
    callback();
  });
}

// ////////// TESTS ///////////////////////

// find all widgets
describe('Widget URIs', function() {
  describe('GET /widgets', function() {
    beforeEach(function(done) {
      async.series([
        function(callback) {
          removeWidgets(callback, {});
        },
        function(callback) {
          saveWidget(callback, new Widget({
            productId: 'YMIYW2VROS',
            name: 'TestWidget_YMIYW2VROS',
            color: 'Black',
            size: 'Huge',
            price: '$99.99',
            inventory: 96
          }));
        },
        function(callback) {
          saveWidget(callback, new Widget({
            productId: 'FGBRYL6XSF',
            name: 'TestWidget_FGBRYL6XSF',
            color: 'Red',
            size: 'Huge',
            price: '$127.49',
            inventory: 1205
          }));
        },
        function(callback) {
          saveWidget(callback, new Widget({
            productId: '5H7HW8Y1E2',
            name: 'TestWidget_5H7HW8Y1E2',
            color: 'Black',
            size: 'Tiny',
            price: '$1.49',
            inventory: 0
          }));
        }], function(error) {
        if (error) {
          log.error(error);
          throw error;
        }
        done();
      });
    });

    afterEach(function(done) {
      removeWidgets(done, {});
    });

    var url = baseUrl + '/widgets';

    var options = {
      method: 'GET',
      url: url,
      headers: {
        accept: 'application/json'
      }
    };

    it('should respond with a status code of 200', function(done) {
      request(options, function(error, response, body) {
        response.statusCode.should.be.exactly(200);
        done();
      });
    });

    it('should respond with exactly (3) widget objects in an array', function(done) {
      request(options, function(error, response, body) {
        if (error) {
          log.error(error);
        }
        var widget = JSON.parse(body);
        widget.should.be.an.instanceof(Array).and.have.a.lengthOf(3);
        done();
      });
    });

    it('should respond with an \'x-total-count\' header containing a value of \'3\'', function(done) {
      request(options, function(error, response, body) {
        response.headers.should.have.a.property('x-total-count', '3');
        done();
      });
    });
  });

  // find one widget
  describe('GET /widgets/:productId', function() {
    beforeEach(function(done) {
      async.series([
        function(callback) {
          removeWidgets(callback, {});
        },
        function(callback) {
          saveWidget(callback, new Widget({
            productId: '4YFZH127BX',
            name: 'TestWidget_4YFZH127BX',
            color: 'Orange',
            size: 'Small',
            price: '$19.93',
            inventory: 13
          }));
        }], function(err) {
        if (err) {
          throw err;
        }
        done();
      });
    });

    afterEach(function(done) {
      removeWidgets(done, {});
    });

    var url1 = baseUrl + '/widgets/4YFZH127BX';

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

    it('should respond with exactly (1) widget object', function(done) {
      request(options1, function(error, response, body) {
        var widget = JSON.parse(body);
        widget.should.be.an.instanceof(Object);
        done();
      });
    });

    it('should respond with the value of \'TestWidget_4YFZH127BX\' for \'name\' key', function(done) {
      request(options1, function(error, response, body) {
        var widget = JSON.parse(body);
        widget.should.have.a.property('name', 'TestWidget_4YFZH127BX');
        done();
      });
    });

    var url2 = baseUrl + '/widgets/BADPRODUCT';

    var options2 = {
      method: 'GET',
      url: url2,
      headers: {
        accept: 'application/json'
      }
    };

    it('should respond with \'null\' when the \'productId\' is not found',
      function(done) {
        request(options2, function(error, response, body) {
          body.should.be.null;
          done();
        });
      });
  });

  // create new widget
  describe('POST /widgets', function() {
    beforeEach(function(done) {
      removeWidgets(done, {});
    });
    afterEach(function(done) {
      removeWidgets(done, {});
    });

    var widget = {
      productId: 'DC3NHTGNAY',
      name: 'TestWidget_DC3NHTGNAY',
      color: 'Green',
      size: 'Big',
      price: '$79.92',
      inventory: 27
    };

    var url = baseUrl + '/widgets';

    var options = {
      method: 'POST',
      url: url,
      headers: {
        accept: 'application/json'
      },
      body: widget,
      json: true
    };

    it('should respond with a status code of 201', function(done) {
      request(options, function(error, response, body) {
        response.statusCode.should.be.exactly(201);
        done();
      });
    });

    it('should respond with exactly (1) widget object', function(done) {
      request(options, function(error, response, body) {
        body.should.be.an.instanceof(Object);
        done();
      });
    });

    it('should respond with a value of \'TestWidget_DC3NHTGNAY\' for \'name\' key', function(done) {
      request(options, function(error, response, body) {
        body.should.have.a.property('name', 'TestWidget_DC3NHTGNAY');
        done();
      });
    });
  });

  // create new widget
  describe('POST /widgets', function() {
    beforeEach(function(done) {
      removeWidgets(done, {});
    });
    afterEach(function(done) {
      removeWidgets(done, {});
    });

    var widget = { // no 'name' key
      productId: 'DC3NHTGNAY',
      color: 'Green',
      size: 'Big',
      price: '$79.92',
      inventory: 27
    };

    var url = baseUrl + '/widgets';

    var options = {
      method: 'POST',
      url: url,
      headers: {
        accept: 'application/json'
      },
      body: widget,
      json: true
    };

    it('should respond with a status code of 500 when missing \'name\' property', function(done) {
      request(options, function(error, response, body) {
        response.statusCode.should.be.exactly(500);
        done();
      });
    });

    it('should respond with an error message: \'Widget validation failed\' when missing \'name\' property', function(done) {
      request(options, function(error, response, body) {
        body.should.have.a.property('message', 'Widget validation failed');
        done();
      });
    });
  });

  // update one widget
  describe('PUT /widgets', function() {
    beforeEach(function(done) {
      async.series([
        function(callback) {
          removeWidgets(callback, {});
        },
        function(callback) {
          saveWidget(callback, new Widget({
            productId: 'ZC7DV7BSPE',
            name: 'TestWidget_ZC7DV7BSPE',
            color: 'Blue',
            size: 'Small',
            price: '$9.92',
            inventory: 27
          }));
        }
      ], function(err) {
        if (err) {
          throw err;
        }
        done();
      });
    });

    afterEach(function(done) {
      removeWidgets(done, {});
    });

    var widget = { // modified inventory level
      productId: 'ZC7DV7BSPE',
      name: 'TestWidget_ZC7DV7BSPE',
      color: 'Blue',
      size: 'Small',
      price: '$9.92',
      inventory: 21
    };

    var url = baseUrl + '/widgets';

    var options = {
      method: 'PUT',
      url: url,
      headers: {
        accept: 'application/json'
      },
      body: widget,
      json: true
    };

    it('should respond with a status code of 200', function(done) {
      request(options, function(error, response, body) {
        response.statusCode.should.be.exactly(200);
        done();
      });
    });

    it('should respond with no response body', function(done) {
      request(options, function(error, response, body) {
        response.should.not.have.a.property('body');
        done();
      });
    });
  });

  // update and confirm one widget
  describe('PUT /widgets', function() {
    beforeEach(function(done) {
      async.series([
        function(callback) {
          removeWidgets(callback, {});
        },
        function(callback) {
          saveWidget(callback, new Widget({
            productId: 'ZC7DV7BSPE',
            name: 'TestWidget_ZC7DV7BSPE',
            color: 'Blue',
            size: 'Small',
            price: '$9.92',
            inventory: 27
          }));
        },
        function(callback) {
          var widget = { // modified inventory level
            productId: 'ZC7DV7BSPE',
            name: 'TestWidget_ZC7DV7BSPE',
            color: 'Blue',
            size: 'Small',
            price: '$9.92',
            inventory: 21
          };

          var url1 = baseUrl + '/widgets';

          var options1 = {
            method: 'PUT',
            url: url1,
            headers: {
              accept: 'application/json'
            },
            body: widget,
            json: true
          };

          request(options1, function(error, response, body) {
            callback();
          });
        }
      ], function(err) {
        if (err) {
          throw err;
        }
        done();
      });
    });

    afterEach(function(done) {
      removeWidgets(done, {});
    });

    var url2 = baseUrl + '/widgets/ZC7DV7BSPE';

    var options2 = {
      method: 'GET',
      url: url2,
      headers: {
        accept: 'application/json'
      }
    };

    it('should respond with new value of \'21\' for \'inventory\' key', function(done) {
      request(options2, function(error, response, body) {
        var widget = JSON.parse(body);
        widget.should.have.a.property('inventory', 21);
        done();
      });
    });
  });

  // delete one widget
  describe('DELETE /widgets/:productId', function() {
    beforeEach(function(done) {
      async.series([
        function(callback) {
          removeWidgets(callback, {});
        },
        function(callback) {
          saveWidget(callback, new Widget({
            productId: '3NDO87DF3C',
            name: 'TestWidget_3NDO87DF3C',
            color: 'Green',
            size: 'Small',
            price: '$71.95',
            inventory: 653
          }));
        }
      ], function(err) {
        if (err) {
          throw err;
        }
        done();
      });
    });

    afterEach(function(done) {
      removeWidgets(done, {});
    });

    var url = baseUrl + '/widgets/3NDO87DF3C';

    var options = {
      method: 'DELETE',
      url: url,
      headers: {
        accept: 'application/json'
      }
    };

    it('should respond with a status code of 204', function(done) {
      request(options, function(error, response, body) {
        response.statusCode.should.be.exactly(204);
        done();
      });
    });

    it('should respond with an empty response body', function(done) {
      request(options, function(error, response, body) {
        body.should.be.exactly('');
        done();
      });
    });
  });
});

