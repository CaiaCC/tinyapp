const { assert } = require('chai');

const { getUserIdByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserIdByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserIdByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    const actulOutput = user;

    assert.deepEqual(actulOutput, expectedOutput);
  });

  it('should return null with not regstered email', function() {
    const user = getUserIdByEmail("user4@example.com", testUsers);
    const expectedOutput = null;
    const actulOutput = user;

    assert.equal(actulOutput, expectedOutput);
  });

});