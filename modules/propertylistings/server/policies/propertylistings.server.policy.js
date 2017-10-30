'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Propertylistings Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/propertylistings',
      permissions: '*'
    }, {
      resources: '/api/propertylistings/:propertylistingId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/propertylistings',
      permissions: ['get', 'post']
    }, {
      resources: '/api/propertylistings/:propertylistingId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/propertylistings',
      permissions: ['get']
    }, {
      resources: '/api/propertylistings/:propertylistingId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Propertylistings Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Propertylisting is being processed and the current user created it then allow any manipulation
  if (req.propertylisting && req.user && req.propertylisting.user && req.propertylisting.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
