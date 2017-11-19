(function () {
  'use strict';

  // Listingproperties controller
  angular
    .module('listingproperties')
    .controller('ListingpropertiesController', ListingpropertiesController);

  ListingpropertiesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'listingpropertyResolve', 'Notification'];

  function ListingpropertiesController($scope, $state, $window, Authentication, listingproperty, Notification) {
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


    $http.get('api/allpackages',function(item){
      $scope.packageType = item;
      console.log($scope.packageType);
    });


    // Save Listingproperty
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.listingpropertyForm');
        console.log('test');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.listingproperty._id) {
        vm.listingproperty.$update(successCallback, errorCallback);
      } else {
        vm.listingproperty.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('listingproperties.list', {
          listingpropertyId: res._id
        });
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Property saved successfully!' });
        console.log(res);

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
