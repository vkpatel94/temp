(function () {
  'use strict';

  describe('Enquires Controller Tests', function () {
    // Initialize global variables
    var EnquiresController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      EnquiresService,
      mockEnquire;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _EnquiresService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      EnquiresService = _EnquiresService_;

      // create mock Enquire
      mockEnquire = new EnquiresService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Enquire Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Enquires controller.
      EnquiresController = $controller('EnquiresController as vm', {
        $scope: $scope,
        enquireResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleEnquirePostData;

      beforeEach(function () {
        // Create a sample Enquire object
        sampleEnquirePostData = new EnquiresService({
          name: 'Enquire Name'
        });

        $scope.vm.enquire = sampleEnquirePostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (EnquiresService) {
        // Set POST response
        $httpBackend.expectPOST('api/enquires', sampleEnquirePostData).respond(mockEnquire);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Enquire was created
        expect($state.go).toHaveBeenCalledWith('enquires.view', {
          enquireId: mockEnquire._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/enquires', sampleEnquirePostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Enquire in $scope
        $scope.vm.enquire = mockEnquire;
      });

      it('should update a valid Enquire', inject(function (EnquiresService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/enquires\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('enquires.view', {
          enquireId: mockEnquire._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (EnquiresService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/enquires\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Enquires
        $scope.vm.enquire = mockEnquire;
      });

      it('should delete the Enquire and redirect to Enquires', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/enquires\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('enquires.list');
      });

      it('should should not delete the Enquire and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
