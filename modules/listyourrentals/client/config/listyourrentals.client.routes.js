(function () {
  'use strict';

  angular
    .module('listyourrentals')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('listyourrentals', {
        abstract: true,
        url: '/listyourrentals',
        template: '<ui-view/>'
      })
      .state('listyourrentals.list', {
        url: '',
        templateUrl: 'modules/listyourrentals/client/views/list-listyourrentals.client.view.html',
        controller: 'ListyourrentalsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Listyourrentals List'
        }
      })
      .state('listyourrentals.create', {
        url: '/create',
        templateUrl: 'modules/listyourrentals/client/views/form-listyourrental.client.view.html',
        controller: 'ListyourrentalsController',
        controllerAs: 'vm',
        resolve: {
          listyourrentalResolve: newListyourrental
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Listyourrentals Create'
        }
      })
      .state('listyourrentals.edit', {
        url: '/:listyourrentalId/edit',
        templateUrl: 'modules/listyourrentals/client/views/form-listyourrental.client.view.html',
        controller: 'ListyourrentalsController',
        controllerAs: 'vm',
        resolve: {
          listyourrentalResolve: getListyourrental
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Listyourrental {{ listyourrentalResolve.name }}'
        }
      })
      .state('listyourrentals.view', {
        url: '/:listyourrentalId',
        templateUrl: 'modules/listyourrentals/client/views/view-listyourrental.client.view.html',
        controller: 'ListyourrentalsController',
        controllerAs: 'vm',
        resolve: {
          listyourrentalResolve: getListyourrental
        },
        data: {
          pageTitle: 'Listyourrental {{ listyourrentalResolve.name }}'
        }
      });
  }

  getListyourrental.$inject = ['$stateParams', 'ListyourrentalsService'];

  function getListyourrental($stateParams, ListyourrentalsService) {
    return ListyourrentalsService.get({
      listyourrentalId: $stateParams.listyourrentalId
    }).$promise;
  }

  newListyourrental.$inject = ['ListyourrentalsService'];

  function newListyourrental(ListyourrentalsService) {
    return new ListyourrentalsService();
  }
}());
