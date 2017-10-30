(function () {
  'use strict';

  describe('Listingproperties Route Tests', function () {
    // Initialize global variables
    var $scope,
      ListingpropertiesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ListingpropertiesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ListingpropertiesService = _ListingpropertiesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('listingproperties');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/listingproperties');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ListingpropertiesController,
          mockListingproperty;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('listingproperties.view');
          $templateCache.put('modules/listingproperties/client/views/view-listingproperty.client.view.html', '');

          // create mock Listingproperty
          mockListingproperty = new ListingpropertiesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Listingproperty Name'
          });

          // Initialize Controller
          ListingpropertiesController = $controller('ListingpropertiesController as vm', {
            $scope: $scope,
            listingpropertyResolve: mockListingproperty
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:listingpropertyId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.listingpropertyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            listingpropertyId: 1
          })).toEqual('/listingproperties/1');
        }));

        it('should attach an Listingproperty to the controller scope', function () {
          expect($scope.vm.listingproperty._id).toBe(mockListingproperty._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/listingproperties/client/views/view-listingproperty.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ListingpropertiesController,
          mockListingproperty;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('listingproperties.create');
          $templateCache.put('modules/listingproperties/client/views/form-listingproperty.client.view.html', '');

          // create mock Listingproperty
          mockListingproperty = new ListingpropertiesService();

          // Initialize Controller
          ListingpropertiesController = $controller('ListingpropertiesController as vm', {
            $scope: $scope,
            listingpropertyResolve: mockListingproperty
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.listingpropertyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/listingproperties/create');
        }));

        it('should attach an Listingproperty to the controller scope', function () {
          expect($scope.vm.listingproperty._id).toBe(mockListingproperty._id);
          expect($scope.vm.listingproperty._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/listingproperties/client/views/form-listingproperty.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ListingpropertiesController,
          mockListingproperty;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('listingproperties.edit');
          $templateCache.put('modules/listingproperties/client/views/form-listingproperty.client.view.html', '');

          // create mock Listingproperty
          mockListingproperty = new ListingpropertiesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Listingproperty Name'
          });

          // Initialize Controller
          ListingpropertiesController = $controller('ListingpropertiesController as vm', {
            $scope: $scope,
            listingpropertyResolve: mockListingproperty
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:listingpropertyId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.listingpropertyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            listingpropertyId: 1
          })).toEqual('/listingproperties/1/edit');
        }));

        it('should attach an Listingproperty to the controller scope', function () {
          expect($scope.vm.listingproperty._id).toBe(mockListingproperty._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/listingproperties/client/views/form-listingproperty.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
