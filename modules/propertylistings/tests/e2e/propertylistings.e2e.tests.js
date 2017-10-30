'use strict';

describe('Propertylistings E2E Tests:', function () {
  describe('Test Propertylistings page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/propertylistings');
      expect(element.all(by.repeater('propertylisting in propertylistings')).count()).toEqual(0);
    });
  });
});
