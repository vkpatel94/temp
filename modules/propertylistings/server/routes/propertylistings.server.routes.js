'use strict';

/**
 * Module dependencies
 */
var propertylistingsPolicy = require('../policies/propertylistings.server.policy'),
  propertylistings = require('../controllers/propertylistings.server.controller');

module.exports = function(app) {
  // Propertylistings Routes
  app.route('/api/propertylistings').all(propertylistingsPolicy.isAllowed)
    .get(propertylistings.list)
    .post(propertylistings.create);

  app.route('/api/propertylistings/:propertylistingId').all(propertylistingsPolicy.isAllowed)
    .get(propertylistings.read)
    .put(propertylistings.update)
    .delete(propertylistings.delete);

  // Finish by binding the Propertylisting middleware
  app.param('propertylistingId', propertylistings.propertylistingByID);
};
