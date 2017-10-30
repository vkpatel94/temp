(function () {
  'use strict';

  describe('Listingproperties Controller Tests', function () {
    // Initialize global variables
    var ListingpropertiesController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ListingpropertiesService,
      mockListingproperty;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ListingpropertiesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ListingpropertiesService = _ListingpropertiesService_;

      // create mock Listingproperty
      mockListingproperty = new ListingpropertiesService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Listingproperty Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Listingproperties controller.
      ListingpropertiesController = $controller('ListingpropertiesController as vm', {
        $scope: $scope,
        listingpropertyResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleListingpropertyPostData;

      beforeEach(function () {
        // Create a sample Listingproperty object
        sampleListingpropertyPostData = new ListingpropertiesService({
          name: 'Listingproperty Name'
        });

        $scope.vm.listingproperty = sampleListingpropertyPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (ListingpropertiesService) {
        // Set POST response
        $httpBackend.expectPOST('api/listingproperties', sampleListingpropertyPostData).respond(mockListingproperty);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Listingproperty was created
        expect($state.go).toHaveBeenCalledWith('listingproperties.view', {
          listingpropertyId: mockListingproperty._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/listingproperties', sampleListingpropertyPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Listingproperty in $scope
        $scope.vm.listingproperty = mockListingproperty;
      });

      it('should update a valid Listingproperty', inject(function (ListingpropertiesService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/listingproperties\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('listingproperties.view', {
          listingpropertyId: mockListingproperty._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (ListingpropertiesService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/listingproperties\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Listingproperties
        $scope.vm.listingproperty = mockListingproperty;
      });

      it('should delete the Listingproperty and redirect to Listingproperties', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/listingproperties\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('listingproperties.list');
      });

      it('should should not delete the Listingproperty and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
