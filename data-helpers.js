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

function generateRandomString() {
  const alphanumeric = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let randomURL = "";
  for (let i = 0; i< 6; i++) {
    randomURL += alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
  };
  return randomURL;
};

function emailLookup(email) {
	for (let user in users) {
    if (users[user].email === email) {
      return false;
    }
	}
	return users[user].id;
};

function isPasswordMatch(password) {
	for (let user in users) {
    if (users[user].password === password) {
      return false;
    }
	}
	return true;
};

module.exports = {generateRandomString, users, urlDatabase, emailLookup, isPasswordMatch}