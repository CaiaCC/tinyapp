const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
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

const generateRandomString = function() {
  const alphanumeric = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomURL = "";
  for (let i = 0; i < 6; i++) {
    randomURL += alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
  }
  return randomURL;
};

const getUserIdByEmail = function(email) {
  for (let user in users) {
    if (users[user].email === email) {
      return users[user].id;
    }
  }
  return null;
};

const isPasswordMatch = function(password) {
  for (let user in users) {
    if (users[user].password === password) {
      return true;
    }
  }
  return false;
};

module.exports = {generateRandomString, users, urlDatabase, getUserIdByEmail, isPasswordMatch};