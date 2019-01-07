var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/users");
var csrf = require("csurf");
var csrfProtection = csrf();

var checking = require("../config/checking");
var checkingisAdmin = require("../config/chekingIsAdmin");

router.use(csrfProtection);
/**Sign Up (Registration)*/
router.get("/signup", function(req, res) {
  var messages = req.flash("error");
  res.render("users/signup", {
    messages: messages,
    hasErrors: messages.length > 0,
    csrfToken: req.csrfToken()
  });
});
router.post(
  "/signup",
  passport.authenticate("local.signup", {
    // successRedirect: '/users/profile',
    failureRedirect: "/users/signup",
    failureFlash: true
  }),
  function(req, res, next) {
    if (req.session.oldUrl) {
      var oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect("/users/profile");
    }
  }
);

/**Sign In (Авторизация)*/
router.get("/login", function(req, res) {
  var messages = req.flash("error");
  res.render("users/login", {
    messages: messages,
    hasErrors: messages.length > 0,
    csrfToken: req.csrfToken()
  });
});
router.post(
  "/login",
  passport.authenticate("local.signin", {
    // successRedirect: '/users/profile',
    failureRedirect: "/users/login",
    failureFlash: true
  }),
  function(req, res, next) {
    if (req.session.oldUrl) {
      var oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect("/users/profile");
    }
  }
);

/**Logout page */
router.get("/logout", function(req, res, next) {
  req.logout();
  res.redirect("/");
});

/**Authorized users */
router.get("/authorized", checkingisAdmin, function(req, res) {
  User.find({}, function(err, docs) {
    if (err) {
      console.log(err);
    }

    res.render("users/authorized", {
      users: docs
    });
  });
});

/**Profile page*/
router.get("/profile", checking, function(req, res) {
  res.render("users/profile", {});
});
module.exports = router;
