(function () {
  'use strict';

  describe('Enquires Route Tests', function () {
    // Initialize global variables
    var $scope,
      EnquiresService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _EnquiresService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      EnquiresService = _EnquiresService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('enquires');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/enquires');
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
          EnquiresController,
          mockEnquire;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('enquires.view');
          $templateCache.put('modules/enquires/client/views/view-enquire.client.view.html', '');

          // create mock Enquire
          mockEnquire = new EnquiresService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Enquire Name'
          });

          // Initialize Controller
          EnquiresController = $controller('EnquiresController as vm', {
            $scope: $scope,
            enquireResolve: mockEnquire
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:enquireId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.enquireResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            enquireId: 1
          })).toEqual('/enquires/1');
        }));

        it('should attach an Enquire to the controller scope', function () {
          expect($scope.vm.enquire._id).toBe(mockEnquire._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/enquires/client/views/view-enquire.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          EnquiresController,
          mockEnquire;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('enquires.create');
          $templateCache.put('modules/enquires/client/views/form-enquire.client.view.html', '');

          // create mock Enquire
          mockEnquire = new EnquiresService();

          // Initialize Controller
          EnquiresController = $controller('EnquiresController as vm', {
            $scope: $scope,
            enquireResolve: mockEnquire
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.enquireResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/enquires/create');
        }));

        it('should attach an Enquire to the controller scope', function () {
          expect($scope.vm.enquire._id).toBe(mockEnquire._id);
          expect($scope.vm.enquire._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/enquires/client/views/form-enquire.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          EnquiresController,
          mockEnquire;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('enquires.edit');
          $templateCache.put('modules/enquires/client/views/form-enquire.client.view.html', '');

          // create mock Enquire
          mockEnquire = new EnquiresService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Enquire Name'
          });

          // Initialize Controller
          EnquiresController = $controller('EnquiresController as vm', {
            $scope: $scope,
            enquireResolve: mockEnquire
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:enquireId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.enquireResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            enquireId: 1
          })).toEqual('/enquires/1/edit');
        }));

        it('should attach an Enquire to the controller scope', function () {
          expect($scope.vm.enquire._id).toBe(mockEnquire._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/enquires/client/views/form-enquire.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
