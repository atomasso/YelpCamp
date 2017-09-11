var express = require('express');
var router  = express.Router();
var passport = require('passport');
var User = require('../models/user');

// route route
router.get("/", function(req, res) {
  res.render("landing");
});

// show register form
router.get("/register", function(req, res) {
  res.render("register", {page: "register"});
});

// handle sign up logic
router.post("/register", function(req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      // or this code instead of the following two lines: return res.render("register", {error: err.message});
      req.flash("error", err.message);
      return res.redirect("/register");
    } 
    passport.authenticate("local")(req, res, function() { 
      req.flash("success", "Successfully Signed Up! Nice to meet you " + user.username);
      // upon redirect, middleware (app.user()) function gets run where we assign res.flash("success2) to res.local.success
      res.redirect("/campgrounds");
    });
  });
});

// render login form
router.get("/login", function(req, res) {
  // display error message from flash upon login error (user not logged in)
  // error defined in middleware - isLoggedin3š()
	res.render("login", {page: "login"});
});

// login logic
// middleware:
// - when the app post request to /login, it's going to run middleware code immediately
// - we can have multiple middlewares stacked up
// - passport.authenticate() tries to log you in, it authenticates your credentials, takes username and password that are in the request 
//  - we don't even need to explicitely provide that, passport automatically takes the username and password form the form, from the request body
//    and compares password that user typed in to the input to the hash value in the db    
router.post("/login", passport.authenticate("local", {
	  // if it works, redirect to /campgrounds
	  successRedirect: "/campgrounds",

    // if it does not work, redirect to /login    
	  failureRedirect: "/login",
    failureFlash: "Invalid username or password"
  }), function(req, res) {

});

// logout route
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/campgrounds");

});

module.exports = router;