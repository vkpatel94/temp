'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Listyourrental = mongoose.model('Listyourrental'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Listyourrental
 */
exports.create = function(req, res) {
  var listyourrental = new Listyourrental(req.body);
  listyourrental.user = req.user;

  listyourrental.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(listyourrental);
    }
  });
};

/**
 * Show the current Listyourrental
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var listyourrental = req.listyourrental ? req.listyourrental.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  listyourrental.isCurrentUserOwner = req.user && listyourrental.user && listyourrental.user._id.toString() === req.user._id.toString();

  res.jsonp(listyourrental);
};

/**
 * Update a Listyourrental
 */
exports.update = function(req, res) {
  var listyourrental = req.listyourrental;

  listyourrental = _.extend(listyourrental, req.body);

  listyourrental.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(listyourrental);
    }
  });
};

/**
 * Delete an Listyourrental
 */
exports.delete = function(req, res) {
  var listyourrental = req.listyourrental;

  listyourrental.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(listyourrental);
    }
  });
};

/**
 * List of Listyourrentals
 */
exports.list = function(req, res) {
  Listyourrental.find().sort('-created').populate('user', 'displayName').exec(function(err, listyourrentals) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(listyourrentals);
    }
  });
};

/**
 * Listyourrental middleware
 */
exports.listyourrentalByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Listyourrental is invalid'
    });
  }

  Listyourrental.findById(id).populate('user', 'displayName').exec(function (err, listyourrental) {
    if (err) {
      return next(err);
    } else if (!listyourrental) {
      return res.status(404).send({
        message: 'No Listyourrental with that identifier has been found'
      });
    }
    req.listyourrental = listyourrental;
    next();
  });
};
