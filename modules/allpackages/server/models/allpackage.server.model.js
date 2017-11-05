'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Allpackage Schema
 */
var AllpackageSchema = new Schema({
  packageName: {
    type: String,
    default: '',
    required: 'Please fill Allpackage name',
    trim: true
  },
  packageType: {
    type: String,
    default: '',
    required: 'Please fill Allpackage name',
    trim: true
  },
  price: {
    type: Number,
    default: '',
    required: 'Please enter prices'
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Allpackage', AllpackageSchema);
