'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Listingproperty Schema
 */
var ListingpropertySchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill property name',
    trim: true
  },
  address: {
    type: String,
    default: '',
    required: 'Please fill property address',
    trim: true
  },
  unit: {
    type: String,
    default: '',
    required: 'Please fill property unit',
    trim: true
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

mongoose.model('Listingproperty', ListingpropertySchema);
