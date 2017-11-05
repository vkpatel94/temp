'use strict';

/**
 * Module dependencies
 */
var enquiresPolicy = require('../policies/enquires.server.policy'),
  enquires = require('../controllers/enquires.server.controller');

module.exports = function(app) {
  // Enquires Routes
  app.route('/api/enquires').all(enquiresPolicy.isAllowed)
    .get(enquires.list)
    .post(enquires.create);

  app.route('/api/enquires/:enquireId').all(enquiresPolicy.isAllowed)
    .get(enquires.read)
    .put(enquires.update)
    .delete(enquires.delete);
  app.route('/api/enquires/sendmail').post(enquires.sendMail);
  // Finish by binding the Enquire middleware
 // app.param('enquireId', enquires.enquireByID);
};
