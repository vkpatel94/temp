'use strict';

/**
 * Module dependencies
 */
var listingpropertiesPolicy = require('../policies/listingproperties.server.policy'),
  listingproperties = require('../controllers/listingproperties.server.controller');

module.exports = function (app) {
  // Listingproperties Routes
  app.route('/api/listingproperties').all(listingpropertiesPolicy.isAllowed)
    .get(listingproperties.list)
    .post(listingproperties.create);

  app.route('/api/listingproperties/:listingpropertyId').all(listingpropertiesPolicy.isAllowed)
    .get(listingproperties.read)
    .put(listingproperties.update)
    .delete(listingproperties.delete);

  // Finish by binding the Listingproperty middleware
  app.param('listingpropertyId', listingproperties.listingpropertyByID);
};
