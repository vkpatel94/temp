// Listyourrentals service used to communicate Listyourrentals REST endpoints
(function () {
  'use strict';

  angular
    .module('listyourrentals')
    .factory('ListyourrentalsService', ListyourrentalsService);

  ListyourrentalsService.$inject = ['$resource'];

  function ListyourrentalsService($resource) {
    return $resource('/api/listyourrentals/:listyourrentalId', {
      listyourrentalId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
