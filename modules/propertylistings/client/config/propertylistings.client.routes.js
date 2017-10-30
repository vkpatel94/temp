(function () {
  'use strict';

  angular
    .module('propertylistings')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('propertylistings', {
        abstract: true,
        url: '/propertylistings',
        template: '<ui-view/>'
      })
      .state('propertylistings.list', {
        url: '',
        templateUrl: 'modules/propertylistings/client/views/list-propertylistings.client.view.html',
        controller: 'PropertylistingsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Propertylistings List'
        }
      })
      .state('propertylistings.create', {
        url: '/create',
        templateUrl: 'modules/propertylistings/client/views/form-propertylisting.client.view.html',
        controller: 'PropertylistingsController',
        controllerAs: 'vm',
        resolve: {
          propertylistingResolve: newPropertylisting
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Propertylistings Create'
        }
      })
      .state('propertylistings.edit', {
        url: '/:propertylistingId/edit',
        templateUrl: 'modules/propertylistings/client/views/form-propertylisting.client.view.html',
        controller: 'PropertylistingsController',
        controllerAs: 'vm',
        resolve: {
          propertylistingResolve: getPropertylisting
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Propertylisting {{ propertylistingResolve.name }}'
        }
      })
      .state('propertylistings.view', {
        url: '/:propertylistingId',
        templateUrl: 'modules/propertylistings/client/views/view-propertylisting.client.view.html',
        controller: 'PropertylistingsController',
        controllerAs: 'vm',
        resolve: {
          propertylistingResolve: getPropertylisting
        },
        data: {
          pageTitle: 'Propertylisting {{ propertylistingResolve.name }}'
        }
      });
  }

  getPropertylisting.$inject = ['$stateParams', 'PropertylistingsService'];

  function getPropertylisting($stateParams, PropertylistingsService) {
    return PropertylistingsService.get({
      propertylistingId: $stateParams.propertylistingId
    }).$promise;
  }

  newPropertylisting.$inject = ['PropertylistingsService'];

  function newPropertylisting(PropertylistingsService) {
    return new PropertylistingsService();
  }
}());
