'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Enquire = mongoose.model('Enquire'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  enquire;

/**
 * Enquire routes tests
 */
describe('Enquire CRUD tests', function () {

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

    // Save a user to the test db and create new Enquire
    user.save(function () {
      enquire = {
        name: 'Enquire name'
      };

      done();
    });
  });

  it('should be able to save a Enquire if logged in', function (done) {
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

        // Save a new Enquire
        agent.post('/api/enquires')
          .send(enquire)
          .expect(200)
          .end(function (enquireSaveErr, enquireSaveRes) {
            // Handle Enquire save error
            if (enquireSaveErr) {
              return done(enquireSaveErr);
            }

            // Get a list of Enquires
            agent.get('/api/enquires')
              .end(function (enquiresGetErr, enquiresGetRes) {
                // Handle Enquires save error
                if (enquiresGetErr) {
                  return done(enquiresGetErr);
                }

                // Get Enquires list
                var enquires = enquiresGetRes.body;

                // Set assertions
                (enquires[0].user._id).should.equal(userId);
                (enquires[0].name).should.match('Enquire name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Enquire if not logged in', function (done) {
    agent.post('/api/enquires')
      .send(enquire)
      .expect(403)
      .end(function (enquireSaveErr, enquireSaveRes) {
        // Call the assertion callback
        done(enquireSaveErr);
      });
  });

  it('should not be able to save an Enquire if no name is provided', function (done) {
    // Invalidate name field
    enquire.name = '';

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

        // Save a new Enquire
        agent.post('/api/enquires')
          .send(enquire)
          .expect(400)
          .end(function (enquireSaveErr, enquireSaveRes) {
            // Set message assertion
            (enquireSaveRes.body.message).should.match('Please fill Enquire name');

            // Handle Enquire save error
            done(enquireSaveErr);
          });
      });
  });

  it('should be able to update an Enquire if signed in', function (done) {
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

        // Save a new Enquire
        agent.post('/api/enquires')
          .send(enquire)
          .expect(200)
          .end(function (enquireSaveErr, enquireSaveRes) {
            // Handle Enquire save error
            if (enquireSaveErr) {
              return done(enquireSaveErr);
            }

            // Update Enquire name
            enquire.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Enquire
            agent.put('/api/enquires/' + enquireSaveRes.body._id)
              .send(enquire)
              .expect(200)
              .end(function (enquireUpdateErr, enquireUpdateRes) {
                // Handle Enquire update error
                if (enquireUpdateErr) {
                  return done(enquireUpdateErr);
                }

                // Set assertions
                (enquireUpdateRes.body._id).should.equal(enquireSaveRes.body._id);
                (enquireUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Enquires if not signed in', function (done) {
    // Create new Enquire model instance
    var enquireObj = new Enquire(enquire);

    // Save the enquire
    enquireObj.save(function () {
      // Request Enquires
      request(app).get('/api/enquires')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Enquire if not signed in', function (done) {
    // Create new Enquire model instance
    var enquireObj = new Enquire(enquire);

    // Save the Enquire
    enquireObj.save(function () {
      request(app).get('/api/enquires/' + enquireObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', enquire.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Enquire with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/enquires/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Enquire is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Enquire which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Enquire
    request(app).get('/api/enquires/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Enquire with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Enquire if signed in', function (done) {
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

        // Save a new Enquire
        agent.post('/api/enquires')
          .send(enquire)
          .expect(200)
          .end(function (enquireSaveErr, enquireSaveRes) {
            // Handle Enquire save error
            if (enquireSaveErr) {
              return done(enquireSaveErr);
            }

            // Delete an existing Enquire
            agent.delete('/api/enquires/' + enquireSaveRes.body._id)
              .send(enquire)
              .expect(200)
              .end(function (enquireDeleteErr, enquireDeleteRes) {
                // Handle enquire error error
                if (enquireDeleteErr) {
                  return done(enquireDeleteErr);
                }

                // Set assertions
                (enquireDeleteRes.body._id).should.equal(enquireSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Enquire if not signed in', function (done) {
    // Set Enquire user
    enquire.user = user;

    // Create new Enquire model instance
    var enquireObj = new Enquire(enquire);

    // Save the Enquire
    enquireObj.save(function () {
      // Try deleting Enquire
      request(app).delete('/api/enquires/' + enquireObj._id)
        .expect(403)
        .end(function (enquireDeleteErr, enquireDeleteRes) {
          // Set message assertion
          (enquireDeleteRes.body.message).should.match('User is not authorized');

          // Handle Enquire error error
          done(enquireDeleteErr);
        });

    });
  });

  it('should be able to get a single Enquire that has an orphaned user reference', function (done) {
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

          // Save a new Enquire
          agent.post('/api/enquires')
            .send(enquire)
            .expect(200)
            .end(function (enquireSaveErr, enquireSaveRes) {
              // Handle Enquire save error
              if (enquireSaveErr) {
                return done(enquireSaveErr);
              }

              // Set assertions on new Enquire
              (enquireSaveRes.body.name).should.equal(enquire.name);
              should.exist(enquireSaveRes.body.user);
              should.equal(enquireSaveRes.body.user._id, orphanId);

              // force the Enquire to have an orphaned user reference
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

                    // Get the Enquire
                    agent.get('/api/enquires/' + enquireSaveRes.body._id)
                      .expect(200)
                      .end(function (enquireInfoErr, enquireInfoRes) {
                        // Handle Enquire error
                        if (enquireInfoErr) {
                          return done(enquireInfoErr);
                        }

                        // Set assertions
                        (enquireInfoRes.body._id).should.equal(enquireSaveRes.body._id);
                        (enquireInfoRes.body.name).should.equal(enquire.name);
                        should.equal(enquireInfoRes.body.user, undefined);

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
      Enquire.remove().exec(done);
    });
  });
});
