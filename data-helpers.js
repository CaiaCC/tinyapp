const urlDatabase = {
  "b2xVn2": { 
    longURL: "http://www.lighthouselabs.ca", 
    userID: "userRandomID"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "user2RandomID"
  }
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

const urlsForUser = function(id) {
  let userURLObj = {};

  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userURLObj[shortURL] = urlDatabase[shortURL];
    }
  }
  return userURLObj;
}

module.exports = {generateRandomString, users, urlDatabase, getUserIdByEmail, isPasswordMatch, urlsForUser};