(function () {
  'use strict';

  angular
    .module('propertylistings')
    .controller('PropertylistingsListController', PropertylistingsListController);

  PropertylistingsListController.$inject = ['PropertylistingsService'];

  function PropertylistingsListController(PropertylistingsService) {
    var vm = this;

    vm.propertylistings = PropertylistingsService.query();
  }
}());
