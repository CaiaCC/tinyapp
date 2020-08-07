const bcrypt = require("bcrypt");

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
    password: "$2b$10$c9iVuketeOoTYibKCisCGegmhYqNP4RVFjomKHxv9u5C.cEpFeNym",
    plainPasswordForTesting: 'purple-monkey-dinosaur'
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "$2b$10$RyRW7nhuK/mhevT30BVNdukJ3HMKTYGU4iOhyiaBHDhxp6BUSu4hC",
    plainPasswordForTesting : 'dishwasher-funk'
  },
  QPihuH: {
    id: 'QPihuH',
    email: 'caiachuang@gmail.com',
    password:
     '$2b$10$5.gm6MNwR3O06dbBBe8Xa.HvEv0DHo6tlBh8422FqeeQp7vt58eNG',
    plainPasswordForTesting: '1'
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
}

module.exports = {generateRandomString, users, urlDatabase, getUserIdByEmail, urlsForUser};