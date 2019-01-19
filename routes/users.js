var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var passport = require('passport');
var Cart = require('../models/cart');
var Order = require('../models/order');
var User = require('../models/users');
var csrf = require('csurf');
var csrfProtection = csrf();

var checking = require('../config/checking');
var checkingisAdmin = require('../config/chekingIsAdmin');
var checkingRole = require('../config/checkingRole');

router.use(csrfProtection);
/**Sign Up (Registration)*/
router.get('/signup', function(req, res) {
  var messages = req.flash('error');
  res.render('users/signup', {
    messages: messages,
    hasErrors: messages.length > 0,
    csrfToken: req.csrfToken()
  });
});
router.post(
  '/signup',

  passport.authenticate('local.signup', {
    // successRedirect: '/users/profile',
    failureRedirect: '/users/signup',
    failureFlash: true
  }),
  checkingRole,
  function(req, res, next) {
    if (req.session.oldUrl) {
      var oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect('/users/profile');
    }
  }
);

/**Sign In (Авторизация)*/
router.get('/login', function(req, res) {
  var messages = req.flash('error');
  res.render('users/login', {
    messages: messages,
    hasErrors: messages.length > 0,
    csrfToken: req.csrfToken()
  });
});
router.post(
  '/login',
  passport.authenticate('local.signin', {
    // successRedirect: '/users/profile',
    failureRedirect: '/users/login',
    failureFlash: true
  }),
  function(req, res, next) {
    if (req.session.oldUrl) {
      var oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(`/users${oldUrl}`);
    } else {
      res.redirect('/users/profile');
    }
  }
);

/**Logout page */
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

/**Profile page*/
router.get('/profile', checking, function(req, res) {
  res.render('users/profile', {});
});

/**Stripe payment + Orders page */
router.get('/checkout', checking, function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shop');
  }
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', {
    totalPrice: cart.totalPrice,
    errMsg: errMsg,
    noErrors: !errMsg,
    csrfToken: req.csrfToken()
  });
});

router.post('/checkout', checking, function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/');
  }
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var stripe = require('stripe')('sk_test_uBQlq7NlnCsHw9ogz0RsAOQE');

  stripe.charges.create(
    {
      amount: cart.totalPrice * 100,
      currency: 'usd',
      source: req.body.stripeToken, // obtained with Stripe.js
      description: 'Test Charge'
    },
    function(err, charge) {
      console.log('Error there ---------' + err);
      if (err) {
        req.flash('error', err.message);
        return res.redirect('users/checkout');
      }
      var order = new Order({
        user: req.user,
        cart: cart,
        adress: req.body.address,
        name: req.body.name,
        paymantId: charge.id,
        totalPrice: cart.totalPrice
      });
      console.log(cart.totalPrice);
      order.save(function(err, result) {
        req.flash('success', 'Successfully bought product');
        req.session.cart = null;
        res.redirect('/users/success-page');
      });
    }
  );
});
router.get('/success-page', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  res.render('success-page', {
    successMsg: successMsg,
    noMessage: !successMsg
  });
});

module.exports = router;
