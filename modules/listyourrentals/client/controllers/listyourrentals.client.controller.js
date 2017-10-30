(function () {
  'use strict';

  // Listyourrentals controller
  angular
    .module('listyourrentals')
    .controller('ListyourrentalsController', ListyourrentalsController);

  ListyourrentalsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'listyourrentalResolve'];

  function ListyourrentalsController ($scope, $state, $window, Authentication, listyourrental) {
    var vm = this;

    vm.authentication = Authentication;
    vm.listyourrental = listyourrental;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Listyourrental
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.listyourrental.$remove($state.go('listyourrentals.list'));
      }
    }

    // Save Listyourrental
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.listyourrentalForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.listyourrental._id) {
        vm.listyourrental.$update(successCallback, errorCallback);
      } else {
        vm.listyourrental.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('listyourrentals.view', {
          listyourrentalId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
