const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const logger = require("morgan");
const passport = require("passport");
const OAuth1Strategy = require("passport-oauth1").Strategy;
const session = require('express-session');
const config = require("./config.js");

const port = 3000;
const appName = "Trifecta";

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, "../client")));

passport.serializeUser(function(user, done) {
  console.log("serializeUser", user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log("serializeUser", user);
  done(null, user);
});

passport.use(new OAuth1Strategy({
    requestTokenURL: 'https://cacoo.com/oauth/request_token',
    accessTokenURL: 'https://cacoo.com/oauth/access_token',
    userAuthorizationURL: 'https://cacoo.com/oauth/authorize',
    consumerKey: config.cacoo.consumerKey,
    consumerSecret: config.cacoo.consumerSecret,
    callbackURL: "http://localhost.cacootest.com:3000/auth/cacoo/callback",
    signatureMethod: "PLAINTEXT"
  },
  function(token, tokenSecret, profile, done) {
    Array.from(arguments).forEach((el, i) => {
      console.log(i, el);
    });

    return done(null, profile);
  }
));

function ensureAuthenticated(req, res, next) {
    console.log("req.isAuthenticated", req.isAuthenticated());
  if (req.isAuthenticated()) {
    // req.user is available for use here
    return next();
  }

  // Denied. Redirect to login
  res.redirect('/');
}

app.get("/", (req, res, next) => res.sendFile(path.join(__dirname, "../client/") + "index.html"));

app.get('/protected', ensureAuthenticated, function(req, res) {
  res.send("Access granted.");
});

app.get("/auth/cacoo/login", passport.authenticate("oauth"));

app.get("/auth/cacoo/callback", passport.authenticate("oauth", {
    failureRedirect: "/auth/cacoo/error"
  }), (req, res, next) => {
    res.redirect("/");
  }
);

app.get("/auth/cacoo/error", (req, res, next) => {
  res.sendStatus(400)
});

app.get('/auth/logout', function(req, res){
  console.log('logging out');
  req.logout();
  res.redirect('/');
});

app.use((req, res, next) => {
	res.sendStatus(404);
});

app.use((err, req, res, next) => {
	console.error(err);
	res.sendStatus(500);
});

app.listen(port, (err) => {
	if (err) console.log(`Error: ${err}`);
	console.log(`${appName} listening on port ${port}!`);
});
