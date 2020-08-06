const {generateRandomString, users, urlDatabase, getUserIdByEmail, isPasswordMatch} = require('./data-helpers');
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
  
  if (password.length === 0 || email.length === 0 || getUserIdByEmail(email)) {
    console.log("Use register with existed email or invalid info");
    res.send(res.statusCode = 400);
  } else {
    console.log(users);
    users[newId] = {newId, email, password};
    res
      .cookie("user_id", newId)
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
      res.send(res.statusCode = 403);
    }
  } else {
    res.send(res.statusCode = 403);
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
    urls: urlDatabase,
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
      res.send(res.statusCode = 400);
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

  if (userId !== undefined) {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  }
  res.redirect("/register");
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  let longURL = req.body.longURL;
  console.log("longURL",longURL );
 
  if (longURL === undefined) {
    res.send(res.statusCode = 403);
  } 
  if (!longURL.includes("http://")) {
    longURL = "http://" + longURL;
  } 
  urlDatabase[shortURL].longURL = longURL;
  res.redirect("/urls");

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

