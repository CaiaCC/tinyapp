const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "user2RandomID"
  },
  "ZZwhhF": {
    longURL: "http://caiachuang.ca",
    userID: "QPihuH"
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

module.exports = {urlDatabase, users};