'use strict';

describe('Listingproperties E2E Tests:', function () {
  describe('Test Listingproperties page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/listingproperties');
      expect(element.all(by.repeater('listingproperty in listingproperties')).count()).toEqual(0);
    });
  });
});
