const {urlDatabase, users} = require('./data');

const generateRandomString = function() {
  const alphanumeric = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomString = "";

  for (let i = 0; i < 6; i++) {
    randomURL += alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
  }
  return randomString;
};

const getUserIdByEmail = function(email, database) {
  for (let id in database) {
    if (users[id].email === email) {
      return users[id].id;
    }
  }
  return null;
};

const urlsForUser = function(id) {
  let userUrls = {};

  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrls[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrls;
};

module.exports = {generateRandomString, getUserIdByEmail, urlsForUser};