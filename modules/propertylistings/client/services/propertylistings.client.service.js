// Propertylistings service used to communicate Propertylistings REST endpoints
(function () {
  'use strict';

  angular
    .module('propertylistings')
    .factory('PropertylistingsService', PropertylistingsService);

  PropertylistingsService.$inject = ['$resource'];

  function PropertylistingsService($resource) {
    return $resource('api/propertylistings/:propertylistingId', {
      propertylistingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
