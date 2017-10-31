'use strict';

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
});
/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Enquire = mongoose.model('Enquire'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Enquire
 */
exports.create = function(req, res) {
  var enquire = new Enquire(req.body);
  enquire.user = req.user;

  enquire.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(enquire);
    }
  });
};

/**
 * Show the current Enquire
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var enquire = req.enquire ? req.enquire.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  enquire.isCurrentUserOwner = req.user && enquire.user && enquire.user._id.toString() === req.user._id.toString();

  res.jsonp(enquire);
};

/**
 * Update a Enquire
 */
exports.update = function(req, res) {
  var enquire = req.enquire;

  enquire = _.extend(enquire, req.body);

  enquire.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(enquire);
    }
  });
};

/**
 * Delete an Enquire
 */
exports.delete = function(req, res) {
  var enquire = req.enquire;

  enquire.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(enquire);
    }
  });
};

/**
 * List of Enquires
 */
exports.list = function(req, res) {
  Enquire.find().sort('-created').populate('user', 'displayName').exec(function(err, enquires) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(enquires);
    }
  });
};

/**
 * Enquire middleware
 */
exports.enquireByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Enquire is invalid'
    });
  }

  Enquire.findById(id).populate('user', 'displayName').exec(function (err, enquire) {
    if (err) {
      return next(err);
    } else if (!enquire) {
      return res.status(404).send({
        message: 'No Enquire with that identifier has been found'
      });
    }
    req.enquire = enquire;
    next();
  });
};


exports.sendMail = function(req, res) {

  var data = req.body;
  console.log("server Controller Data :: " + data)
  transporter.sendMail({
    from: data.contactEmail,
    to: 'viral4u14@gmail.com',
    subject: 'Message from ' + data.contactName,
    text: data.contactMsg
  });

  res.json(data);
};
