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

app.get("/", (req, res) => {
  res.send("How you doing?");
});



app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  const id = req.session.user_id;
  const shortURLOwnerId = urlDatabase[shortURL].userID;
  
  if (id === shortURLOwnerId) {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  }
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  let longURL = req.body.longURL;
  const id = req.session.user_id;
  const shortURLOwnerId = urlDatabase[shortURL].userID;
 
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

app.post("/u/logout", (req, res) => {
  const id = req.session.user_id;

  req.session = null;
  res.redirect("/urls");
});

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

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id = getUserIdByEmail(email, users);

  if (id) {
    const isPasswordMatch = bcrypt.compareSync(password, users[id].password);
    
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

app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  const shortURL = generateRandomString();
  const id = req.session.user_id;
  const user = users[id];

  if (!user) return res.redirect("/register");
  if (longURL.length === 0) return res.status(400).send("Invalid URL...");
  
  if (!longURL.includes("http://")) {
    longURL = "http://" + longURL;
  }
  let urlDatabaseShortURLs = Object.keys(urlDatabase);
  
  for (let shortURL of urlDatabaseShortURLs) {
    if (urlDatabase[shortURL].longURL === longURL) {
      return res.redirect("/urls/" + shortURL);
    }
  }
  urlDatabase[shortURL] = {longURL,  userID: id};
  return res.redirect("/urls");
  
});

app.listen(PORT, () => {
  console.log(`Caia's TinyApp is listening to port ${PORT}`);
});

