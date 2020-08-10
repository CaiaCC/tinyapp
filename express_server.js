const {generateRandomString, getUserIdByEmail, urlsForUser} = require('./helpers');
const {urlDatabase, users} = require('./data');
const express = require('express');
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 8080;
let templateVars = {};

app.use(bodyParser.urlencoded({extend: true}));
app.use(cookieSession({
  name: 'youCanNotSeeMeLol',
  keys: ['doNoTell']
}));
app.set("view engine", "ejs");

//GET
app.get("/register", (req, res) => {
  const userId = req.session.user_id;
  templateVars = {
    urls: urlDatabase,
    user: users[userId]
  };

  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const id = req.session.user_id;
  templateVars = {
    urls: urlDatabase,
    user: users[id]
  };

  res.render("login", templateVars);
});

app.get("/urls", (req, res) => {
  const id = req.session.user_id;
  templateVars = {
    urls: urlsForUser(id),
    user: users[id]
  };
  
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const id = req.session.user_id;
  const user = users[id];
  templateVars = {
    urls: urlDatabase,
    user
  };

  if (!user) {
    res.redirect("/login");
  } else {
    res.render("urls_new", templateVars);
  } 
});

app.get("/urls/:shortURL", (req, res) => {
  const id = req.session.user_id;
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const user = users[id];
  templateVars = {shortURL,longURL, user};
  
  if (!user) {
    res.redirect("/login");
  } else {
    res.render("urls_show", templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL].longURL;

  if (!longURL.includes("http://")) {
    longURL = "http://" + longURL;
  }
  res.redirect(longURL);
});

app.get("/", (req, res) => {
  res.send("How you doing?");
});


// POST
// user register page
app.post("/register", (req, res) => {
  const {email, password} = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const id = generateRandomString();
  
  if (!email) {
    res.status(400).send("Invalid email...");
  }
  if (!password) {
    res.status(400).send("Invalid password...");
  }
  if (getUserIdByEmail(email, users)) {
    res.status(400).send("This email is already registerd...");
  } else {
    users[id] = {id, email, password: hashedPassword};
    req.session.user_id = id;
    res.redirect("urls");
  }
});

// user log in
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id = getUserIdByEmail(email, users);
  // check if user is registerd
  if (id) {
    const isPasswordMatch = bcrypt.compareSync(password, users[id].password);
    // check if user enter valid password
    if (isPasswordMatch) {
      req.session.user_id = id;
      res.redirect("urls");
    } else {
      res.status(403).send("Password invalid...");
    }
  } else {
    res.status(403).send("Please register first...");
  }
});

app.post("/u/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// user can only modify their own URLs
app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  const shortURL = generateRandomString();
  const id = req.session.user_id;
  const user = users[id];
  // check if user is registered
  if (!user) return res.redirect("/register");
  if (!longURL) return res.status(400).send("Invalid URL...");
  if (!longURL.includes("http://")) {
    longURL = "http://" + longURL;
  }
  let userUrls = urlsForUser(id);
  let userShortURLs = Object.keys(userUrls);
  // check if the URL is already exist in user's urlDatabase;
  // if so, refirect to urls/:shortURL to modify the existed URL
  if (userUrls) {
    for (let userShortURL of userShortURLs) {
      if (userUrls[userShortURL].longURL === longURL) {
        return res.redirect("/urls/" + userShortURL);
      }
    }
  }
  urlDatabase[shortURL] = {longURL,  userID: id};
  return res.redirect("/urls");
});

// user can only delete their own URLs
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  const id = req.session.user_id;
  const shortURLOwnerId = urlDatabase[shortURL].userID;
  
  if (id === shortURLOwnerId) {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  }
});

// user modify URL page
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  let longURL = req.body.longURL;
  const id = req.session.user_id;
  const shortURLOwnerId = urlDatabase[shortURL].userID;
  // user can only modify their own URLs
  if (id === shortURLOwnerId) {
    if (longURL === undefined) {
      res.status(403).send("Invalid URL...");
    }
    if (!longURL.includes("http://")) {
      longURL = "http://" + longURL;
    }
    urlDatabase[shortURL].longURL = longURL;
    res.redirect("/urls");
  }
});

app.listen(PORT, () => {
  console.log(`Caia's TinyApp is listening to port ${PORT}`);
});

