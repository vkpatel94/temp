'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Propertylisting = mongoose.model('Propertylisting'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  propertylisting;

/**
 * Propertylisting routes tests
 */
describe('Propertylisting CRUD tests', function () {

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

    // Save a user to the test db and create new Propertylisting
    user.save(function () {
      propertylisting = {
        name: 'Propertylisting name'
      };

      done();
    });
  });

  it('should be able to save a Propertylisting if logged in', function (done) {
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

        // Save a new Propertylisting
        agent.post('/api/propertylistings')
          .send(propertylisting)
          .expect(200)
          .end(function (propertylistingSaveErr, propertylistingSaveRes) {
            // Handle Propertylisting save error
            if (propertylistingSaveErr) {
              return done(propertylistingSaveErr);
            }

            // Get a list of Propertylistings
            agent.get('/api/propertylistings')
              .end(function (propertylistingsGetErr, propertylistingsGetRes) {
                // Handle Propertylistings save error
                if (propertylistingsGetErr) {
                  return done(propertylistingsGetErr);
                }

                // Get Propertylistings list
                var propertylistings = propertylistingsGetRes.body;

                // Set assertions
                (propertylistings[0].user._id).should.equal(userId);
                (propertylistings[0].name).should.match('Propertylisting name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Propertylisting if not logged in', function (done) {
    agent.post('/api/propertylistings')
      .send(propertylisting)
      .expect(403)
      .end(function (propertylistingSaveErr, propertylistingSaveRes) {
        // Call the assertion callback
        done(propertylistingSaveErr);
      });
  });

  it('should not be able to save an Propertylisting if no name is provided', function (done) {
    // Invalidate name field
    propertylisting.name = '';

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

        // Save a new Propertylisting
        agent.post('/api/propertylistings')
          .send(propertylisting)
          .expect(400)
          .end(function (propertylistingSaveErr, propertylistingSaveRes) {
            // Set message assertion
            (propertylistingSaveRes.body.message).should.match('Please fill Propertylisting name');

            // Handle Propertylisting save error
            done(propertylistingSaveErr);
          });
      });
  });

  it('should be able to update an Propertylisting if signed in', function (done) {
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

        // Save a new Propertylisting
        agent.post('/api/propertylistings')
          .send(propertylisting)
          .expect(200)
          .end(function (propertylistingSaveErr, propertylistingSaveRes) {
            // Handle Propertylisting save error
            if (propertylistingSaveErr) {
              return done(propertylistingSaveErr);
            }

            // Update Propertylisting name
            propertylisting.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Propertylisting
            agent.put('/api/propertylistings/' + propertylistingSaveRes.body._id)
              .send(propertylisting)
              .expect(200)
              .end(function (propertylistingUpdateErr, propertylistingUpdateRes) {
                // Handle Propertylisting update error
                if (propertylistingUpdateErr) {
                  return done(propertylistingUpdateErr);
                }

                // Set assertions
                (propertylistingUpdateRes.body._id).should.equal(propertylistingSaveRes.body._id);
                (propertylistingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Propertylistings if not signed in', function (done) {
    // Create new Propertylisting model instance
    var propertylistingObj = new Propertylisting(propertylisting);

    // Save the propertylisting
    propertylistingObj.save(function () {
      // Request Propertylistings
      request(app).get('/api/propertylistings')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Propertylisting if not signed in', function (done) {
    // Create new Propertylisting model instance
    var propertylistingObj = new Propertylisting(propertylisting);

    // Save the Propertylisting
    propertylistingObj.save(function () {
      request(app).get('/api/propertylistings/' + propertylistingObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', propertylisting.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Propertylisting with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/propertylistings/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Propertylisting is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Propertylisting which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Propertylisting
    request(app).get('/api/propertylistings/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Propertylisting with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Propertylisting if signed in', function (done) {
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

        // Save a new Propertylisting
        agent.post('/api/propertylistings')
          .send(propertylisting)
          .expect(200)
          .end(function (propertylistingSaveErr, propertylistingSaveRes) {
            // Handle Propertylisting save error
            if (propertylistingSaveErr) {
              return done(propertylistingSaveErr);
            }

            // Delete an existing Propertylisting
            agent.delete('/api/propertylistings/' + propertylistingSaveRes.body._id)
              .send(propertylisting)
              .expect(200)
              .end(function (propertylistingDeleteErr, propertylistingDeleteRes) {
                // Handle propertylisting error error
                if (propertylistingDeleteErr) {
                  return done(propertylistingDeleteErr);
                }

                // Set assertions
                (propertylistingDeleteRes.body._id).should.equal(propertylistingSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Propertylisting if not signed in', function (done) {
    // Set Propertylisting user
    propertylisting.user = user;

    // Create new Propertylisting model instance
    var propertylistingObj = new Propertylisting(propertylisting);

    // Save the Propertylisting
    propertylistingObj.save(function () {
      // Try deleting Propertylisting
      request(app).delete('/api/propertylistings/' + propertylistingObj._id)
        .expect(403)
        .end(function (propertylistingDeleteErr, propertylistingDeleteRes) {
          // Set message assertion
          (propertylistingDeleteRes.body.message).should.match('User is not authorized');

          // Handle Propertylisting error error
          done(propertylistingDeleteErr);
        });

    });
  });

  it('should be able to get a single Propertylisting that has an orphaned user reference', function (done) {
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

          // Save a new Propertylisting
          agent.post('/api/propertylistings')
            .send(propertylisting)
            .expect(200)
            .end(function (propertylistingSaveErr, propertylistingSaveRes) {
              // Handle Propertylisting save error
              if (propertylistingSaveErr) {
                return done(propertylistingSaveErr);
              }

              // Set assertions on new Propertylisting
              (propertylistingSaveRes.body.name).should.equal(propertylisting.name);
              should.exist(propertylistingSaveRes.body.user);
              should.equal(propertylistingSaveRes.body.user._id, orphanId);

              // force the Propertylisting to have an orphaned user reference
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

                    // Get the Propertylisting
                    agent.get('/api/propertylistings/' + propertylistingSaveRes.body._id)
                      .expect(200)
                      .end(function (propertylistingInfoErr, propertylistingInfoRes) {
                        // Handle Propertylisting error
                        if (propertylistingInfoErr) {
                          return done(propertylistingInfoErr);
                        }

                        // Set assertions
                        (propertylistingInfoRes.body._id).should.equal(propertylistingSaveRes.body._id);
                        (propertylistingInfoRes.body.name).should.equal(propertylisting.name);
                        should.equal(propertylistingInfoRes.body.user, undefined);

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
      Propertylisting.remove().exec(done);
    });
  });
});
