(function () {
  'use strict';

  angular
    .module('enquires')
    .controller('EnquiresListController', EnquiresListController);

  EnquiresListController.$inject = ['EnquiresService'];

  function EnquiresListController(EnquiresService) {
    var vm = this;

    vm.enquires = EnquiresService.query();
  }
}());
