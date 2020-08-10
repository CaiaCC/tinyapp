const {urlDatabase, users} = require('./data');

// generate a string which has 6 ramdon alphanumeric characters
const generateRandomString = function() {
  const alphanumeric = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomString = "";

  for (let i = 0; i < 6; i++) {
    randomString += alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
  }
  return randomString;
};

// check if email is registered; if so, return user id
const getUserIdByEmail = function(email, database) {
  for (let id in database) {
    if (users[id].email === email) {
      return users[id].id;
    }
  }
  return null;
};

// generate user's unique URL database since each user can only edit their own URLs
const urlsForUser = function(id) {
  const userUrls = {};

  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrls[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrls;
};

module.exports = {generateRandomString, getUserIdByEmail, urlsForUser};