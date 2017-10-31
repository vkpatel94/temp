'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Enquire Schema
 */
var EnquireSchema = new Schema({
  contactName: {
    type: String,
    default: '',
    required: 'Please fill Enquire name',
    trim: true
  },
  contactEmail: {
    type: String,
    default: '',
    required: 'Please fill Enquire email',
    trim: true
  },
  contactMsg: {
    type: String,
    default: '',
    required: 'Please fill Enquire message  ',
    trim: true
  },
});

mongoose.model('Enquire', EnquireSchema);
