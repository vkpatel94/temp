(function () {
  'use strict';

  angular
    .module('listingproperties')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Listingproperties',
      state: 'listingproperties',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'listingproperties', {
      title: 'List Listingproperties',
      state: 'listingproperties.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'listingproperties', {
      title: 'Create Listingproperty',
      state: 'listingproperties.create',
      roles: ['user']
    });
  }
}());
