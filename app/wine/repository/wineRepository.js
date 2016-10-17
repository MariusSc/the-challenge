'use strinct';
var path = require('path');
var wineValidator = require(path.join(__dirname, './wineValidator'));

module.exports = {
  add: function(wine, callback) {
    var validationResult = wineValidator.validateWineObject(wine);
    if (validationResult) {
      return callback(validationResult);
    }
    this.addInternal(wine, callback);
  },
  addInternal: function(wine, callback) {
    throw new Error("Should be set by appComposer");
  },

  update: function(wineId, wine, callback) {
    var validationResult = wineValidator.validateWineObject(wine);
    if (validationResult) {
      return callback(validationResult);
    }
    this.updateInternal(wineId, wine, callback);
  },
  updateInternal: function(wine, callback) {
    throw new Error("Should be set by appComposer");
  },

  delete: function(wineId, callback) {
    this.deleteInternal(wineId, callback);
  },
  deleteInternal: function(wineId, callback) {
    throw new Error("Should be set by appComposer");
  },

  find: function(query, callback) {
    this.findInternal(query, callback);
  },
  findInternal: function(query, callback) {
    throw new Error("Should be set by appComposer");
  }
};

