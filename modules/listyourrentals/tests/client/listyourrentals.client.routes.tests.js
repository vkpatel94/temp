(function () {
  'use strict';

  describe('Listyourrentals Route Tests', function () {
    // Initialize global variables
    var $scope,
      ListyourrentalsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ListyourrentalsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ListyourrentalsService = _ListyourrentalsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('listyourrentals');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/listyourrentals');
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
          ListyourrentalsController,
          mockListyourrental;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('listyourrentals.view');
          $templateCache.put('modules/listyourrentals/client/views/view-listyourrental.client.view.html', '');

          // create mock Listyourrental
          mockListyourrental = new ListyourrentalsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Listyourrental Name'
          });

          // Initialize Controller
          ListyourrentalsController = $controller('ListyourrentalsController as vm', {
            $scope: $scope,
            listyourrentalResolve: mockListyourrental
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:listyourrentalId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.listyourrentalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            listyourrentalId: 1
          })).toEqual('/listyourrentals/1');
        }));

        it('should attach an Listyourrental to the controller scope', function () {
          expect($scope.vm.listyourrental._id).toBe(mockListyourrental._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/listyourrentals/client/views/view-listyourrental.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ListyourrentalsController,
          mockListyourrental;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('listyourrentals.create');
          $templateCache.put('modules/listyourrentals/client/views/form-listyourrental.client.view.html', '');

          // create mock Listyourrental
          mockListyourrental = new ListyourrentalsService();

          // Initialize Controller
          ListyourrentalsController = $controller('ListyourrentalsController as vm', {
            $scope: $scope,
            listyourrentalResolve: mockListyourrental
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.listyourrentalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/listyourrentals/create');
        }));

        it('should attach an Listyourrental to the controller scope', function () {
          expect($scope.vm.listyourrental._id).toBe(mockListyourrental._id);
          expect($scope.vm.listyourrental._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/listyourrentals/client/views/form-listyourrental.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ListyourrentalsController,
          mockListyourrental;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('listyourrentals.edit');
          $templateCache.put('modules/listyourrentals/client/views/form-listyourrental.client.view.html', '');

          // create mock Listyourrental
          mockListyourrental = new ListyourrentalsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Listyourrental Name'
          });

          // Initialize Controller
          ListyourrentalsController = $controller('ListyourrentalsController as vm', {
            $scope: $scope,
            listyourrentalResolve: mockListyourrental
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:listyourrentalId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.listyourrentalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            listyourrentalId: 1
          })).toEqual('/listyourrentals/1/edit');
        }));

        it('should attach an Listyourrental to the controller scope', function () {
          expect($scope.vm.listyourrental._id).toBe(mockListyourrental._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/listyourrentals/client/views/form-listyourrental.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
