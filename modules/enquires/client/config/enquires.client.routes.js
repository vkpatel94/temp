(function () {
  'use strict';

  angular
    .module('enquires')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('enquires', {
        abstract: true,
        url: '/enquires',
        template: '<ui-view/>'
      })
      .state('enquires.list', {
        url: '',
        templateUrl: 'modules/enquires/client/views/list-enquires.client.view.html',
        controller: 'EnquiresController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Enquires List'
        }
      })
      .state('enquires.create', {
        url: '/create',
        templateUrl: 'modules/enquires/client/views/form-enquire.client.view.html',
        controller: 'EnquiresController',
        controllerAs: 'vm',
        resolve: {
          enquireResolve: newEnquire
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Enquires Create'
        }
      })
      .state('enquires.edit', {
        url: '/:enquireId/edit',
        templateUrl: 'modules/enquires/client/views/form-enquire.client.view.html',
        controller: 'EnquiresController',
        controllerAs: 'vm',
        resolve: {
          enquireResolve: getEnquire
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Enquire {{ enquireResolve.name }}'
        }
      })
      .state('enquires.view', {
        url: '/:enquireId',
        templateUrl: 'modules/enquires/client/views/view-enquire.client.view.html',
        controller: 'EnquiresController',
        controllerAs: 'vm',
        resolve: {
          enquireResolve: getEnquire
        },
        data: {
          pageTitle: 'Enquire {{ enquireResolve.name }}'
        }
      });
  }

  getEnquire.$inject = ['$stateParams', 'EnquiresService'];

  function getEnquire($stateParams, EnquiresService) {
    return EnquiresService.get({
      enquireId: $stateParams.enquireId
    }).$promise;
  }

  newEnquire.$inject = ['EnquiresService'];

  function newEnquire(EnquiresService) {
    return new EnquiresService();
  }
}());
