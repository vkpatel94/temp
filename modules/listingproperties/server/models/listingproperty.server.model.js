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
  city: {
    type: String,
    default: '',
    trim: true
  },
  unit: {
    type: String,
    default: '',
    required: 'Please fill property unit',
    trim: true
  },
  propertyImageURL: {
    type: String,
    default: 'modules/users/client/img/profile/default.png'
  },
  noofbedroom: {
    type: Number,
    default: '',
    required: 'Please enter number of bedrooms',
    trim: true
  },
  propertydescription: {
    type: String,
    default: '',
    trim: true
  },
  price: {
    type: Number,
    default: '',
    required: 'Please enter prices'
  },
  pacakgeType: {Schema.ObjectId},

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
