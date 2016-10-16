'use strict';

var path = require('path');
var config = require(path.join(__dirname, '/config/config'));

var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

// Turns mongoose verbose modus on
// mongoose.set('debug', true);
mongoose.Promise = require('bluebird');

module.exports = function() {
  var dbUrl = ''.concat('mongodb://', config.db.host, ':', config.db.port, '/', config.db.name);
  mongoose.connect(dbUrl);
  autoIncrement.initialize(mongoose.connection);

  // var db = mongoose.connection;
  // db.on('connected', function () {
  //   log.info('Mongodb connection open to ' + db_url);
  // });
  // db.on('error', function () {
  //   throw new Error('unable to connect to database at ' + db_url);
  // });
  // db.on('disconnected', function () {
  //   log.info('Mongodb connection disconnected');
  // });
  // process.on('SIGINT', function () {
  //   db.close(function () {
  //     log.info('Mongodb connection disconnected through app termination');
  //     process.exit(0);
  //   });
  // });
};
