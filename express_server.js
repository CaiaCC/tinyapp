const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extend: true}));
app.use(cookieParser());
app.set("view engine", "ejs");

function generateRandomString() {
  const alphanumeric = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let randomURL = "";
  for (let i = 0; i< 6; i++) {
    randomURL += alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
  };
  return randomURL;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
let templateVars = {};



app.get("/urls/new", (req, res) => {
  templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
  };
  
  res.render("urls_new", templateVars);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
});


app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;

  delete urlDatabase[shortURL];
  res.redirect("/urls")
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

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL] ;
  templateVars = {
    shortURL,
    longURL,
    username: req.cookies["username"]
  };
 
  res.render("urls_show", templateVars);
});

app.post("/u/logout", (req, res) => {
  res
    .clearCookie("username")
    .redirect("/urls");
    console.log("user signed out")
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];

  if (!longURL.includes("http://" )) {
    longURL = "http://" + longURL;
  }
  res.redirect(longURL);
});

app.get("/urls", (req, res) => {
  templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
  };
  
  res.render("urls_index", templateVars);
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  templateVars = {
    username, 
    urls: urlDatabase
  };

  res
    .cookie('username', username)
    .render("urls_index", templateVars);
  console.log(`User: "${username}" just signed in.`)
});

app.get("/login", (req, res) => {
  templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
  };

  res.render("urls_index", templateVars);
});


app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  const shortURL = generateRandomString();
  
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

app.get("/", (req, res) => {
  res.send("How you doing?");
});

app.listen(PORT, () => {
  console.log(`Example app listening to on port ${PORT}`);
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

/*
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World<b></body></html>\n")
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
 });
 
 app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
 });
*/


