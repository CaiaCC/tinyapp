const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extend: true}));

app.set("view engine", "ejs");

function generateRandomString() {
	const alphanumeric = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	let outputShortURL = "";
	for (let i = 0; i< 6; i++) {
		outputShortURL += alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
	};
	return outputShortURL;
}

const urlDatabase = {
	"b2xVn2": "http://www.lighthouselabs.ca",
	"9sm5xK": "http://www.google.com"
};
// let urlDatabaseKeys = Object.keys(urlDatabase)
app.get("/", (req, res) => {
	res.send("How you doing?");
});

app.get("/urls", (req, res) => {
	let templateVars = {urls: urlDatabase};
	
	res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
	console.log(req.body);
	let longURL = req.body.longURL;
	const shortURL = generateRandomString();
	
	urlDatabase[shortURL] = longURL;
	// let templateVars = {shortURL, longURL};
	res.redirect(200, "/urls/" + shortURL);
	// res.render("urls_show", templateVars);
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

app.get("/urls/:shortURL", (req, res) => {
	const shortURL = req.params.shortURL
	const longURL = urlDatabase[shortURL] 
  let templateVars = {shortURL, longURL};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
	const longURL = urlDatabase[req.params.shortURL];
	
	if (!longURL.includes("http://" )) {
		res.redirect("http://" + longURL);
	}
	res.redirect(longURL);
	res.end();
});

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

app.listen(PORT, () => {
	console.log(`Example app listening to on port ${PORT}`);
});

