(function () {
  'use strict';

  angular
    .module('allpackages')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Allpackages',
      state: 'allpackages',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'allpackages', {
      title: 'View Packages',
      state: 'allpackages.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'allpackages', {
      title: 'Create Allpackage',
      state: 'allpackages.create',
      roles: ['user']
    });

    menuService.addSubMenuItem('topbar', 'allpackages', {
      title: 'Update Packages',
      state: 'allpackages.update',
      roles: ['user']
    });
  }
}());
