'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Propertylisting = mongoose.model('Propertylisting'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Propertylisting
 */
exports.create = function(req, res) {
  var propertylisting = new Propertylisting(req.body);
  propertylisting.user = req.user;

  propertylisting.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(propertylisting);
    }
  });
};

/**
 * Show the current Propertylisting
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var propertylisting = req.propertylisting ? req.propertylisting.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  propertylisting.isCurrentUserOwner = req.user && propertylisting.user && propertylisting.user._id.toString() === req.user._id.toString();

  res.jsonp(propertylisting);
};

/**
 * Update a Propertylisting
 */
exports.update = function(req, res) {
  var propertylisting = req.propertylisting;

  propertylisting = _.extend(propertylisting, req.body);

  propertylisting.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(propertylisting);
    }
  });
};

/**
 * Delete an Propertylisting
 */
exports.delete = function(req, res) {
  var propertylisting = req.propertylisting;

  propertylisting.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(propertylisting);
    }
  });
};

/**
 * List of Propertylistings
 */
exports.list = function(req, res) {
  Propertylisting.find().sort('-created').populate('user', 'displayName').exec(function(err, propertylistings) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(propertylistings);
    }
  });
};

/**
 * Propertylisting middleware
 */
exports.propertylistingByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Propertylisting is invalid'
    });
  }

  Propertylisting.findById(id).populate('user', 'displayName').exec(function (err, propertylisting) {
    if (err) {
      return next(err);
    } else if (!propertylisting) {
      return res.status(404).send({
        message: 'No Propertylisting with that identifier has been found'
      });
    }
    req.propertylisting = propertylisting;
    next();
  });
};
