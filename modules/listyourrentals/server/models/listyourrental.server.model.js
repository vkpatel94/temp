'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Listyourrental Schema
 */
var ListyourrentalSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Listyourrental name',
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

mongoose.model('Listyourrental', ListyourrentalSchema);
