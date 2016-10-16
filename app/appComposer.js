'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function(server) {
  var dir = __dirname;
  fs.readdirSync(dir).forEach(function(fileOrDir) {
    var fullFileOrDir = path.join(__dirname, fileOrDir);
    var stats = fs.statSync(fullFileOrDir);
    if (stats.isDirectory()) {
      var dir = fullFileOrDir;
      require(path.join(dir, 'composeApp'))(server);
    }
  });
};
