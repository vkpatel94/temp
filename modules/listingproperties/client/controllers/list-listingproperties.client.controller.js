// (function () {
//   'use strict';

//   angular
//     .module('listingproperties')
//     .controller('ListingpropertiesListController', ListingpropertiesListController);

//   ListingpropertiesListController.$inject = ['ListingpropertiesService'];

//   function ListingpropertiesListController(ListingpropertiesService) {
//     var vm = this;

//     vm.listingproperties = ListingpropertiesService.query();

//     //console.log(vm.listingproperties);
//   }
// }());

(function () {
  'use strict';

  angular
    .module('listingproperties')
    .controller('ListingpropertiesListController', ListingpropertiesListController);

  ListingpropertiesListController.$inject = [ '$filter', 'ListingpropertiesService'];

  function ListingpropertiesListController($filter, ListingpropertiesService) {
    var vm = this;

    vm.listingproperties = ListingpropertiesService.query();
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.buildPager = buildPager;

    ListingpropertiesService.query(function (data) {
      vm.listingproperties = data;
      vm.buildPager();
    });
    console.log(vm.listingproperties);
    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.listingproperties, {
        $: vm.search
      });
      console.log(vm.filteredItems);

      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
      console.log();
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }


    console.log(vm.listingproperties);
  }
}());
