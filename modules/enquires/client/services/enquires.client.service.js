// Enquires service used to communicate Enquires REST endpoints
(function () {
  'use strict';

  angular
    .module('enquires')
    .factory('EnquiresService', EnquiresService);

  EnquiresService.$inject = ['$resource'];

  function EnquiresService($resource) {
    return $resource('api/enquires/:enquireId', {
      enquireId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
