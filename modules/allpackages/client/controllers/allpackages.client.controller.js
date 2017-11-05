(function () {
  'use strict';

  // Allpackages controller
  angular
    .module('allpackages')
    .controller('AllpackagesController', AllpackagesController);

  AllpackagesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'allpackageResolve'];

  function AllpackagesController ($scope, $state, $window, Authentication, allpackage) {
    var vm = this;

    vm.authentication = Authentication;
    vm.allpackage = allpackage;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Allpackage
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.allpackage.$remove($state.go('allpackages.list'));
      }
    }

    // Save Allpackage
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.allpackageForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.allpackage._id) {
        vm.allpackage.$update(successCallback, errorCallback);
      } else {
        vm.allpackage.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('allpackages.view', {
          allpackageId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
