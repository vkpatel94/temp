'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Listingproperty = mongoose.model('Listingproperty'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Listingproperty
 */
exports.create = function (req, res) {
  var listingproperty = new Listingproperty(req.body);
  listingproperty.user = req.user;
  console.log(listingproperty.user);
  listingproperty.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(listingproperty);
    }
  });
};

/**
 * Show the current Listingproperty
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var listingproperty = req.listingproperty ? req.listingproperty.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  listingproperty.isCurrentUserOwner = req.user && listingproperty.user && listingproperty.user._id.toString() === req.user._id.toString();

  res.jsonp(listingproperty);
};

/**
 * Update a Listingproperty
 */
exports.update = function (req, res) {
  var listingproperty = req.listingproperty;

  listingproperty = _.extend(listingproperty, req.body);

  listingproperty.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(listingproperty);
    }
  });
};

/**
 * Delete an Listingproperty
 */
exports.delete = function (req, res) {
  var listingproperty = req.listingproperty;

  listingproperty.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(listingproperty);
    }
  });
};

/**
 * List of Listingproperties
 */
exports.list = function (req, res) {
  Listingproperty.find().sort('-created').populate('user', 'displayName').exec(function (err, listingproperties) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(listingproperties);
    }
  });
};

/**
 * Listingproperty middleware
 */
exports.listingpropertyByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Listingproperty is invalid'
    });
  }

  Listingproperty.findById(id).populate('user', 'displayName').exec(function (err, listingproperty) {
    if (err) {
      return next(err);
    } else if (!listingproperty) {
      return res.status(404).send({
        message: 'No Listingproperty with that identifier has been found'
      });
    }
    req.listingproperty = listingproperty;
    next();
  });
};
