(function () {
  'use strict';

  // Listingproperties controller
  angular
    .module('listingproperties')
    .controller('ListingpropertiesController', ListingpropertiesController);

  ListingpropertiesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'listingpropertyResolve'];

  function ListingpropertiesController ($scope, $state, $window, Authentication, listingproperty) {
    var vm = this;

    vm.authentication = Authentication;
    vm.listingproperty = listingproperty;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Listingproperty
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.listingproperty.$remove($state.go('listingproperties.list'));
      }
    }

    // Save Listingproperty
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.listingpropertyForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.listingproperty._id) {
        vm.listingproperty.$update(successCallback, errorCallback);
      } else {
        vm.listingproperty.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('listingproperties.view', {
          listingpropertyId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
