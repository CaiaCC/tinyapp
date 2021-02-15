const express = require('express');
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');

const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9xm5xK": "http://www.google.com",
};

app.get("/", (req, res) => {
    res.send("Hello!");
});

app.get('/urls', (req, res) => {
    const templateVars = { urls: urlDatabase };
    res.render('urls_index', templateVars)
});

app.get('/urls/:shortURL', (req, res) => {
    const shortURL = req.params.shortURL;
    const longURL = urlDatabase[shortURL];
    const templateVars = { shortURL, longURL };
    
    res.render("urls_show", templateVars);
});

// app.get('/urls/:longURL', (req, res) => {
//      const templateVars = { urls: urlDatabase };
//      res.render("urls_show", templateVars);
// });

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});