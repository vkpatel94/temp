(function () {
  'use strict';

  angular
    .module('listingproperties')
    .controller('ListingpropertiesListController', ListingpropertiesListController);

  ListingpropertiesListController.$inject = ['ListingpropertiesService'];

  function ListingpropertiesListController(ListingpropertiesService) {
    var vm = this;

    vm.listingproperties = ListingpropertiesService.query();
  }
}());
