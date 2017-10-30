'use strict';

/**
 * Module dependencies
 */
var listyourrentalsPolicy = require('../policies/listyourrentals.server.policy'),
  listyourrentals = require('../controllers/listyourrentals.server.controller');

module.exports = function(app) {
  // Listyourrentals Routes
  app.route('/api/listyourrentals').all(listyourrentalsPolicy.isAllowed)
    .get(listyourrentals.list)
    .post(listyourrentals.create);

  app.route('/api/listyourrentals/:listyourrentalId').all(listyourrentalsPolicy.isAllowed)
    .get(listyourrentals.read)
    .put(listyourrentals.update)
    .delete(listyourrentals.delete);

  // Finish by binding the Listyourrental middleware
  app.param('listyourrentalId', listyourrentals.listyourrentalByID);
};
