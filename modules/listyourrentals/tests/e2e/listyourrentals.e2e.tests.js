'use strict';

describe('Listyourrentals E2E Tests:', function () {
  describe('Test Listyourrentals page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/listyourrentals');
      expect(element.all(by.repeater('listyourrental in listyourrentals')).count()).toEqual(0);
    });
  });
});
