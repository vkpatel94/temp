(function () {
  'use strict';

  angular
    .module('propertylistings')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    // menuService.addMenuItem('topbar', {
    //   title: 'Propertylistings',
    //   state: 'propertylistings',
    //   type: 'dropdown',
    //   roles: ['*']
    // });

    // // Add the dropdown list item
    // menuService.addSubMenuItem('topbar', 'propertylistings', {
    //   title: 'List Propertylistings',
    //   state: 'propertylistings.list'
    // });

    // // Add the dropdown create item
    // menuService.addSubMenuItem('topbar', 'propertylistings', {
    //   title: 'Create Propertylisting',
    //   state: 'propertylistings.create',
    //   roles: ['user']
    // });
  }
}());
