(function () {
  'use strict';

  angular
    .module('listyourrentals')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Listyourrentals',
      state: 'listyourrentals',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'listyourrentals', {
      title: 'List Listyourrentals',
      state: 'listyourrentals.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'listyourrentals', {
      title: 'Create Listyourrental',
      state: 'listyourrentals.create',
      roles: ['user']
    });
  }
}());
