const {generateRandomString, users, urlDatabase, getUserIdByEmail, isPasswordMatch, urlsForUser} = require('./data-helpers');
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
  const newUserId = generateRandomString();
  
  if (email.length === 0) {
    res.status(400).send("Invalid email...");
  }
  if (password.length === 0) {
    res.status(400).send("Invalid password...");
  } 
  if (getUserIdByEmail(email)) {
    res.status(400).send("This email is already registerd...");
  }
  else {
    console.log(users);
    users[newId] = {newId, email, password};
    res
      .cookie("user_id", newUserId)
      .redirect("urls");
  }
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
  const registeredId = getUserIdByEmail(email);

  if (registeredId) {
    if (isPasswordMatch(password)) {
      res
        .cookie('user_id', registeredId)
        .redirect("urls");
    } else {
      res.status(403).send("Password invalid...");
    }
  } else {
    res.status(403).send("User isn't registered...");
  }
});

app.get("/login", (req, res) => {
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
  console.log("user signed out");
});

app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"];
  templateVars = {
    urls: urlDatabase,
    user: users[userId]
  };

  if(userId !== undefined) {
    res.render("urls_new", templateVars);
  }
    res.redirect("/register")
});

app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  templateVars = {
    urls: urlsForUser(userId),
    user: users[userId]
  };
  
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  const shortURL = generateRandomString();
  const userId = req.cookies["user_id"];

  if (userId !== undefined) {
    if (longURL.length === 0) {
      res.status(400).send("Invalid URL...");
    }
    if (!longURL.includes("http://")) {
      longURL = "http://" + longURL;
    }
    let urlDatabaseKeys = Object.keys(urlDatabase);
    
    for (let key of urlDatabaseKeys) {
      if (urlDatabase[key] === longURL) {
        return res.redirect("/urls/" + key);
      }
    }
    urlDatabase[shortURL].longURL = longURL;
    res.redirect("/urls/" + shortURL);
  } else {
    res.redirect("/register");
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  const userId = req.cookies["user_id"];
  const shortURLOwnerId = urlDatabase[shortURL].userID;
  
  if (userId === shortURLOwnerId) {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  }

});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  let longURL = req.body.longURL;
  const userId = req.cookies["user_id"];
  const shortURLOwnerId = urlDatabase[shortURL].userID;
 
  if (userId === shortURLOwnerId) {
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

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const userId = req.cookies["user_id"];
  
  templateVars = {
    shortURL,
    longURL,
    user: users[userId]
  };

  res.render("urls_show", templateVars);
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

