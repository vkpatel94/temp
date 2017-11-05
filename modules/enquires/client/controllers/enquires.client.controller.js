'use strict';
angular.module('enquires').controller('EnquiresController', ['$scope', '$http', '$animate',
  function($scope, $http, $animate) {
// Expose view variables
/*
    $scope.toastPosition = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };
    $scope.getToastPosition = function () {
      return Object.keys($scope.toastPosition)
        .filter(function (pos) {
          return $scope.toastPosition[pos];
        })
        .join(' ');
    };
*/
    this.sendMail = function () {

      var data = ({
        contactName : this.contactName,
        contactEmail : this.contactEmail,
        contactMsg : this.contactMsg
      });
      console.log("contactName :: " + data.contactName + " contactEmail :: " + data.contactEmail + " cotnactMsg :: " + data.contactMsg);
      //console.log("Data :: " + data.contactName);
      // Simple POST request example (passing data) :
      $http.post('/api/enquires/sendmail', data).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
/*
        $mdToast.show(
          $mdToast.simple()
            .content('Thanks for your message ' + data.contactName + ' You Rock!')
            .position($scope.getToastPosition())
            .hideDelay(5000)
        );*/

      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

    };
  }
]);
