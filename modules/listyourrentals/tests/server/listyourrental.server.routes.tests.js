'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Listyourrental = mongoose.model('Listyourrental'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  listyourrental;

/**
 * Listyourrental routes tests
 */
describe('Listyourrental CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Listyourrental
    user.save(function () {
      listyourrental = {
        name: 'Listyourrental name'
      };

      done();
    });
  });

  it('should be able to save a Listyourrental if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Listyourrental
        agent.post('/api/listyourrentals')
          .send(listyourrental)
          .expect(200)
          .end(function (listyourrentalSaveErr, listyourrentalSaveRes) {
            // Handle Listyourrental save error
            if (listyourrentalSaveErr) {
              return done(listyourrentalSaveErr);
            }

            // Get a list of Listyourrentals
            agent.get('/api/listyourrentals')
              .end(function (listyourrentalsGetErr, listyourrentalsGetRes) {
                // Handle Listyourrentals save error
                if (listyourrentalsGetErr) {
                  return done(listyourrentalsGetErr);
                }

                // Get Listyourrentals list
                var listyourrentals = listyourrentalsGetRes.body;

                // Set assertions
                (listyourrentals[0].user._id).should.equal(userId);
                (listyourrentals[0].name).should.match('Listyourrental name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Listyourrental if not logged in', function (done) {
    agent.post('/api/listyourrentals')
      .send(listyourrental)
      .expect(403)
      .end(function (listyourrentalSaveErr, listyourrentalSaveRes) {
        // Call the assertion callback
        done(listyourrentalSaveErr);
      });
  });

  it('should not be able to save an Listyourrental if no name is provided', function (done) {
    // Invalidate name field
    listyourrental.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Listyourrental
        agent.post('/api/listyourrentals')
          .send(listyourrental)
          .expect(400)
          .end(function (listyourrentalSaveErr, listyourrentalSaveRes) {
            // Set message assertion
            (listyourrentalSaveRes.body.message).should.match('Please fill Listyourrental name');

            // Handle Listyourrental save error
            done(listyourrentalSaveErr);
          });
      });
  });

  it('should be able to update an Listyourrental if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Listyourrental
        agent.post('/api/listyourrentals')
          .send(listyourrental)
          .expect(200)
          .end(function (listyourrentalSaveErr, listyourrentalSaveRes) {
            // Handle Listyourrental save error
            if (listyourrentalSaveErr) {
              return done(listyourrentalSaveErr);
            }

            // Update Listyourrental name
            listyourrental.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Listyourrental
            agent.put('/api/listyourrentals/' + listyourrentalSaveRes.body._id)
              .send(listyourrental)
              .expect(200)
              .end(function (listyourrentalUpdateErr, listyourrentalUpdateRes) {
                // Handle Listyourrental update error
                if (listyourrentalUpdateErr) {
                  return done(listyourrentalUpdateErr);
                }

                // Set assertions
                (listyourrentalUpdateRes.body._id).should.equal(listyourrentalSaveRes.body._id);
                (listyourrentalUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Listyourrentals if not signed in', function (done) {
    // Create new Listyourrental model instance
    var listyourrentalObj = new Listyourrental(listyourrental);

    // Save the listyourrental
    listyourrentalObj.save(function () {
      // Request Listyourrentals
      request(app).get('/api/listyourrentals')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Listyourrental if not signed in', function (done) {
    // Create new Listyourrental model instance
    var listyourrentalObj = new Listyourrental(listyourrental);

    // Save the Listyourrental
    listyourrentalObj.save(function () {
      request(app).get('/api/listyourrentals/' + listyourrentalObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', listyourrental.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Listyourrental with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/listyourrentals/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Listyourrental is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Listyourrental which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Listyourrental
    request(app).get('/api/listyourrentals/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Listyourrental with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Listyourrental if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Listyourrental
        agent.post('/api/listyourrentals')
          .send(listyourrental)
          .expect(200)
          .end(function (listyourrentalSaveErr, listyourrentalSaveRes) {
            // Handle Listyourrental save error
            if (listyourrentalSaveErr) {
              return done(listyourrentalSaveErr);
            }

            // Delete an existing Listyourrental
            agent.delete('/api/listyourrentals/' + listyourrentalSaveRes.body._id)
              .send(listyourrental)
              .expect(200)
              .end(function (listyourrentalDeleteErr, listyourrentalDeleteRes) {
                // Handle listyourrental error error
                if (listyourrentalDeleteErr) {
                  return done(listyourrentalDeleteErr);
                }

                // Set assertions
                (listyourrentalDeleteRes.body._id).should.equal(listyourrentalSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Listyourrental if not signed in', function (done) {
    // Set Listyourrental user
    listyourrental.user = user;

    // Create new Listyourrental model instance
    var listyourrentalObj = new Listyourrental(listyourrental);

    // Save the Listyourrental
    listyourrentalObj.save(function () {
      // Try deleting Listyourrental
      request(app).delete('/api/listyourrentals/' + listyourrentalObj._id)
        .expect(403)
        .end(function (listyourrentalDeleteErr, listyourrentalDeleteRes) {
          // Set message assertion
          (listyourrentalDeleteRes.body.message).should.match('User is not authorized');

          // Handle Listyourrental error error
          done(listyourrentalDeleteErr);
        });

    });
  });

  it('should be able to get a single Listyourrental that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Listyourrental
          agent.post('/api/listyourrentals')
            .send(listyourrental)
            .expect(200)
            .end(function (listyourrentalSaveErr, listyourrentalSaveRes) {
              // Handle Listyourrental save error
              if (listyourrentalSaveErr) {
                return done(listyourrentalSaveErr);
              }

              // Set assertions on new Listyourrental
              (listyourrentalSaveRes.body.name).should.equal(listyourrental.name);
              should.exist(listyourrentalSaveRes.body.user);
              should.equal(listyourrentalSaveRes.body.user._id, orphanId);

              // force the Listyourrental to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Listyourrental
                    agent.get('/api/listyourrentals/' + listyourrentalSaveRes.body._id)
                      .expect(200)
                      .end(function (listyourrentalInfoErr, listyourrentalInfoRes) {
                        // Handle Listyourrental error
                        if (listyourrentalInfoErr) {
                          return done(listyourrentalInfoErr);
                        }

                        // Set assertions
                        (listyourrentalInfoRes.body._id).should.equal(listyourrentalSaveRes.body._id);
                        (listyourrentalInfoRes.body.name).should.equal(listyourrental.name);
                        should.equal(listyourrentalInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Listyourrental.remove().exec(done);
    });
  });
});
