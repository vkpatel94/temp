'use strict';

describe('Enquires E2E Tests:', function () {
  describe('Test Enquires page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/enquires');
      expect(element.all(by.repeater('enquire in enquires')).count()).toEqual(0);
    });
  });
});
