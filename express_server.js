const {generateRandomString, users, urlDatabase, emailLookup, isPasswordMatch} = require('./data-helpers')
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extend: true}));
app.use(cookieParser());
app.set("view engine", "ejs");



let templateVars = {};

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const newId = generateRandomString();
  
  if (password.length === 0 || email.length === 0 || !isPasswordMatch(email)) {
    console.log("Register with existed emil or invalid")
    res.send(res.statusCode = 400);
  } else {
    users[newId] = {newId, email, password};
    res
      .cookie("user_id", newId)
      .redirect("urls");
  }
  console.log(users);
  console.log(res.cookie())
});

app.get("/register", (req, res) => {
  const userId = req.cookies["user_id"];
  templateVars = {
    urls: urlDatabase,
    user: users[userId]
  };

  res.render("register", templateVars);
});


app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (emailLookup(email)) {
    console.log("id by email",emailLookup(email))
    if (isPasswordMatch(password)) {
      console.log("passwordmatch",isPasswordMatch(password))
      res
        .cookie('user_id', emailLookup(email))
        .redirect("urls");
    } else {
      res.send(res.statusCode = 400);
    }
  } else {
    res.redirect("/register");
  }
});

app.get("/login", (req, res) => {
  // const email = req.body.email;
  // const userId = emailLookup(email);
  const userId = req.cookies["user_id"];
  templateVars = {
    urls: urlDatabase,
    user: users[userId]
  };

  res.render("login", templateVars);
});

app.post("/u/logout", (req, res) => {
  res
    .clearCookie("user_id")
    .redirect("/urls");
    console.log("user signed out")
});

app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"];
  templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase,
    user: users[userId]
  };
  
  res.render("urls_new", templateVars);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
});

app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];

  templateVars = {
    // username: req.cookies["username"],
    urls: urlDatabase,
    user: users[userId]
  };
  
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  const shortURL = generateRandomString();
  if (longURL.length === 0) {
    res.send(res.statusCode = 400);
  }
  if (!longURL.includes("http://" )) {
    longURL = "http://" + longURL;
  }
  let urlDatabaseKeys = Object.keys(urlDatabase);
  
  for (let key of urlDatabaseKeys) {
    if (urlDatabase[key] === longURL) {
      return res.redirect("/urls/" + key);
    } 
  }
  urlDatabase[shortURL] = longURL;
  return res.redirect("/urls/" + shortURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;

  delete urlDatabase[shortURL];
  res.redirect("/urls")
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const userId = req.cookies["user_id"];
  templateVars = {
    shortURL,
    longURL,
    username: req.cookies["username"],
    user: users[userId]
  };
 
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  const shortURL= req.params.id;
  let longURL = req.body.longURL;
  
  if (longURL.length === 0) {
    return res.redirect("/urls");
  }
  if (!longURL.includes("http://" )) {
    longURL = "http://" + longURL;
  }
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];

  if (!longURL.includes("http://" )) {
    longURL = "http://" + longURL;
  }
  res.redirect(longURL);
});

app.get("/", (req, res) => {
  res.send("How you doing?");
});

app.listen(PORT, () => {
  console.log(`Caia's TinyApp is listening to port ${PORT}`);
});



//check if the request url is in the database
/*
let reqLongURL = req.body.longURL;
for (let key of urlDatabaseKeys) {
  if (urlDatabase[key] === reqLongURL) {
    res.send("It already has a short URL")
  } else {
    const reqShortURL = generateRandomString();
    urlDatabase[reqShortURL] = reqLongURL
  }
}
*/

