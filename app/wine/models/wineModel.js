'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var uniqueValidator = require('mongoose-unique-validator');

var wineSchema = new Schema({
  id: {type: Number, required: true, index: true, unique: true},
  name: {type: String, required: true},
  year: {type: Number, required: true},
  country: {type: String, required: true},
  type: {
    type: String, required: true,
    enum: ['red', 'white', 'rose']
  },
  description: {type: String, required: false}
});

wineSchema.plugin(autoIncrement.plugin, {model: 'Wine', field: 'id'});
wineSchema.plugin(uniqueValidator);

var Wine = mongoose.model('Wine', wineSchema);
module.exports = Wine;
