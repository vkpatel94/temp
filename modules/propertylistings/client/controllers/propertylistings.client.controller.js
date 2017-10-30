(function () {
  'use strict';

  // Propertylistings controller
  angular
    .module('propertylistings')
    .controller('PropertylistingsController', PropertylistingsController);

  PropertylistingsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'propertylistingResolve'];

  function PropertylistingsController ($scope, $state, $window, Authentication, propertylisting) {
    var vm = this;

    vm.authentication = Authentication;
    vm.propertylisting = propertylisting;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Propertylisting
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.propertylisting.$remove($state.go('propertylistings.list'));
      }
    }

    // Save Propertylisting
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.propertylistingForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.propertylisting._id) {
        vm.propertylisting.$update(successCallback, errorCallback);
      } else {
        vm.propertylisting.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('propertylistings.view', {
          propertylistingId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
