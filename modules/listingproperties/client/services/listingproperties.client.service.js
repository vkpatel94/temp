// Listingproperties service used to communicate Listingproperties REST endpoints
(function () {
  'use strict';

  angular
    .module('listingproperties')
    .factory('ListingpropertiesService', ListingpropertiesService);

  ListingpropertiesService.$inject = ['$resource'];

  function ListingpropertiesService($resource) {
    return $resource('/api/listingproperties/:listingpropertyId', {
      listingpropertyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
