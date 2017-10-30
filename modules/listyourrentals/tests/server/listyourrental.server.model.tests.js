'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Listyourrental = mongoose.model('Listyourrental');

/**
 * Globals
 */
var user,
  listyourrental;

/**
 * Unit tests
 */
describe('Listyourrental Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      listyourrental = new Listyourrental({
        name: 'Listyourrental Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return listyourrental.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      listyourrental.name = '';

      return listyourrental.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Listyourrental.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
