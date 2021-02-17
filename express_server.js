const express = require('express');
const bodyParser = require('body-parser');
const { shortURLGenerator } = require('./helpers');

const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9xm5xK": "http://www.google.com",
};


app.get("/", (req, res) => {
    res.send("Welcome to TinyApp!");
});

app.get('/urls', (req, res) => {
    const templateVars = { urls: urlDatabase };
    res.render('urls_index', templateVars)
});

app.post('/urls', (req, res) => {
    const { lonqURL } = req.body.longURL;
    const shortURL = shortURLGenerator();
    console.log(req);
    res.send('Ok')
});

app.get('/urls/new',(req, res) => {
    res.render('urls_new');
});

app.get('/urls/:shortURL', (req, res) => {
    const shortURL = req.params.shortURL;
    const longURL = urlDatabase[shortURL];
    const templateVars = { shortURL, longURL };
    
    res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});