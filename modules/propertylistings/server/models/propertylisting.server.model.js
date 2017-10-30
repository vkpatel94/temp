'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Propertylisting Schema
 */
var PropertylistingSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Propertylisting name',
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

mongoose.model('Propertylisting', PropertylistingSchema);
