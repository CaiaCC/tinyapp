const {urlDatabase, users} = require('./data');

const generateRandomString = function() {
  const alphanumeric = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomURL = "";
  for (let i = 0; i < 6; i++) {
    randomURL += alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
  }
  return randomURL;
};

const getUserIdByEmail = function(email, database) {
  for (let id in database) {
    if (users[id].email === email) {
      return users[id].id;
    }
  }
  return null;
};
/*
const isPasswordMatch = function(password) {
  for (let id in users) {
    let isMatch = bcrypt.compareSync(password, users[id].password);
    if (isMatch) return true;
    console.log(isMatch)
  }
  return false;
};*/

const urlsForUser = function(id) {
  let userUrlObj = {};

  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrlObj[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrlObj;
};

module.exports = {generateRandomString, getUserIdByEmail, urlsForUser};