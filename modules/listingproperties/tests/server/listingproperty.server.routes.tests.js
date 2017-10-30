'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Listingproperty = mongoose.model('Listingproperty'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  listingproperty;

/**
 * Listingproperty routes tests
 */
describe('Listingproperty CRUD tests', function () {

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

    // Save a user to the test db and create new Listingproperty
    user.save(function () {
      listingproperty = {
        name: 'Listingproperty name'
      };

      done();
    });
  });

  it('should be able to save a Listingproperty if logged in', function (done) {
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

        // Save a new Listingproperty
        agent.post('/api/listingproperties')
          .send(listingproperty)
          .expect(200)
          .end(function (listingpropertySaveErr, listingpropertySaveRes) {
            // Handle Listingproperty save error
            if (listingpropertySaveErr) {
              return done(listingpropertySaveErr);
            }

            // Get a list of Listingproperties
            agent.get('/api/listingproperties')
              .end(function (listingpropertiesGetErr, listingpropertiesGetRes) {
                // Handle Listingproperties save error
                if (listingpropertiesGetErr) {
                  return done(listingpropertiesGetErr);
                }

                // Get Listingproperties list
                var listingproperties = listingpropertiesGetRes.body;

                // Set assertions
                (listingproperties[0].user._id).should.equal(userId);
                (listingproperties[0].name).should.match('Listingproperty name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Listingproperty if not logged in', function (done) {
    agent.post('/api/listingproperties')
      .send(listingproperty)
      .expect(403)
      .end(function (listingpropertySaveErr, listingpropertySaveRes) {
        // Call the assertion callback
        done(listingpropertySaveErr);
      });
  });

  it('should not be able to save an Listingproperty if no name is provided', function (done) {
    // Invalidate name field
    listingproperty.name = '';

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

        // Save a new Listingproperty
        agent.post('/api/listingproperties')
          .send(listingproperty)
          .expect(400)
          .end(function (listingpropertySaveErr, listingpropertySaveRes) {
            // Set message assertion
            (listingpropertySaveRes.body.message).should.match('Please fill Listingproperty name');

            // Handle Listingproperty save error
            done(listingpropertySaveErr);
          });
      });
  });

  it('should be able to update an Listingproperty if signed in', function (done) {
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

        // Save a new Listingproperty
        agent.post('/api/listingproperties')
          .send(listingproperty)
          .expect(200)
          .end(function (listingpropertySaveErr, listingpropertySaveRes) {
            // Handle Listingproperty save error
            if (listingpropertySaveErr) {
              return done(listingpropertySaveErr);
            }

            // Update Listingproperty name
            listingproperty.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Listingproperty
            agent.put('/api/listingproperties/' + listingpropertySaveRes.body._id)
              .send(listingproperty)
              .expect(200)
              .end(function (listingpropertyUpdateErr, listingpropertyUpdateRes) {
                // Handle Listingproperty update error
                if (listingpropertyUpdateErr) {
                  return done(listingpropertyUpdateErr);
                }

                // Set assertions
                (listingpropertyUpdateRes.body._id).should.equal(listingpropertySaveRes.body._id);
                (listingpropertyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Listingproperties if not signed in', function (done) {
    // Create new Listingproperty model instance
    var listingpropertyObj = new Listingproperty(listingproperty);

    // Save the listingproperty
    listingpropertyObj.save(function () {
      // Request Listingproperties
      request(app).get('/api/listingproperties')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Listingproperty if not signed in', function (done) {
    // Create new Listingproperty model instance
    var listingpropertyObj = new Listingproperty(listingproperty);

    // Save the Listingproperty
    listingpropertyObj.save(function () {
      request(app).get('/api/listingproperties/' + listingpropertyObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', listingproperty.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Listingproperty with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/listingproperties/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Listingproperty is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Listingproperty which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Listingproperty
    request(app).get('/api/listingproperties/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Listingproperty with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Listingproperty if signed in', function (done) {
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

        // Save a new Listingproperty
        agent.post('/api/listingproperties')
          .send(listingproperty)
          .expect(200)
          .end(function (listingpropertySaveErr, listingpropertySaveRes) {
            // Handle Listingproperty save error
            if (listingpropertySaveErr) {
              return done(listingpropertySaveErr);
            }

            // Delete an existing Listingproperty
            agent.delete('/api/listingproperties/' + listingpropertySaveRes.body._id)
              .send(listingproperty)
              .expect(200)
              .end(function (listingpropertyDeleteErr, listingpropertyDeleteRes) {
                // Handle listingproperty error error
                if (listingpropertyDeleteErr) {
                  return done(listingpropertyDeleteErr);
                }

                // Set assertions
                (listingpropertyDeleteRes.body._id).should.equal(listingpropertySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Listingproperty if not signed in', function (done) {
    // Set Listingproperty user
    listingproperty.user = user;

    // Create new Listingproperty model instance
    var listingpropertyObj = new Listingproperty(listingproperty);

    // Save the Listingproperty
    listingpropertyObj.save(function () {
      // Try deleting Listingproperty
      request(app).delete('/api/listingproperties/' + listingpropertyObj._id)
        .expect(403)
        .end(function (listingpropertyDeleteErr, listingpropertyDeleteRes) {
          // Set message assertion
          (listingpropertyDeleteRes.body.message).should.match('User is not authorized');

          // Handle Listingproperty error error
          done(listingpropertyDeleteErr);
        });

    });
  });

  it('should be able to get a single Listingproperty that has an orphaned user reference', function (done) {
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

          // Save a new Listingproperty
          agent.post('/api/listingproperties')
            .send(listingproperty)
            .expect(200)
            .end(function (listingpropertySaveErr, listingpropertySaveRes) {
              // Handle Listingproperty save error
              if (listingpropertySaveErr) {
                return done(listingpropertySaveErr);
              }

              // Set assertions on new Listingproperty
              (listingpropertySaveRes.body.name).should.equal(listingproperty.name);
              should.exist(listingpropertySaveRes.body.user);
              should.equal(listingpropertySaveRes.body.user._id, orphanId);

              // force the Listingproperty to have an orphaned user reference
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

                    // Get the Listingproperty
                    agent.get('/api/listingproperties/' + listingpropertySaveRes.body._id)
                      .expect(200)
                      .end(function (listingpropertyInfoErr, listingpropertyInfoRes) {
                        // Handle Listingproperty error
                        if (listingpropertyInfoErr) {
                          return done(listingpropertyInfoErr);
                        }

                        // Set assertions
                        (listingpropertyInfoRes.body._id).should.equal(listingpropertySaveRes.body._id);
                        (listingpropertyInfoRes.body.name).should.equal(listingproperty.name);
                        should.equal(listingpropertyInfoRes.body.user, undefined);

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
      Listingproperty.remove().exec(done);
    });
  });
});
