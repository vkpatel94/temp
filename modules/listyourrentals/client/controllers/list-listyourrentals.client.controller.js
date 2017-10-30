(function () {
  'use strict';

  angular
    .module('listyourrentals')
    .controller('ListyourrentalsListController', ListyourrentalsListController);

  ListyourrentalsListController.$inject = ['ListyourrentalsService'];

  function ListyourrentalsListController(ListyourrentalsService) {
    var vm = this;

    vm.listyourrentals = ListyourrentalsService.query();
  }
}());
