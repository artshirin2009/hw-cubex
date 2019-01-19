var express = require('express');

var router = express.Router();

const mongoose = require('mongoose');
var Cart = require('../models/cart');

var Product = require('../models/products');

var csrf = require('csurf');
var csrfProtection = csrf();

var checking = require('../config/checking');
var checkingisAdmin = require('../config/chekingIsAdmin');
/* GET home page. */

router.use(csrfProtection);

router.get('/', function(req, res, next) {
  console.log(Date.now());
  var role;
  if (req.user !== undefined) {
    var role = req.user.role;
  } else {
    role = 0;
  }
  Product.find().then(function(doc, req) {
    console.log('role - ' + role);
    res.render('shop/index', {
      role: role,
      products: doc
    });
  });
});

/**Details page */
router.get('/details/:id', function(req, res, next) {
  var productId = req.params.id;
  req.session.oldUrl = req.url;
  Product.findById(productId, function(err, product) {
    console.log(product);
    res.render('shop/details-product', {
      product: product
    });
  });
});

router.get('/details/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product) {
    cart.add(product, product.id);
    req.session.cart = cart;
    var oldUrl = req.session.oldUrl;
    res.redirect(oldUrl);
    req.session.oldUrl = null;
  });
});

router.get('/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product) {
    cart.add(product, product.id);
    req.session.cart = cart;
    res.redirect('/');
  });
});

router.get('/cart', function(req, res, next) {
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  if (cart.totalQty < 1) {
    res.redirect('/');
  } else {
    res.render('shop/cart', {
      cart: cart.generateArray()
    });
  }
});

router.get('/cart/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product) {
    cart.add(product, product.id);
    req.session.cart = cart;
    res.redirect('/cart');
  });
});
router.get('/cart/remove-one-from-cart/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product) {
    cart.remove(product, product.id);
    req.session.cart = cart;
    res.redirect('/cart');
  });
});

/**Add products page (only for admin) *image is a string*/
// router.get("/add-product", function(req, res, next) {
//   res.render("shop/add-product", {});
// });

// router.post("/shop/add-product", function(req, res, next) {
//   var product = {
//     _id: new mongoose.Types.ObjectId(),
//     imagePath: req.body.imagePath,
//     title: req.body.title,
//     description: req.body.description,
//     price: req.body.price
//   };
//   var newProduct = new Product(product);
//   console.log("saving");
//   newProduct.save();
//   console.log(newProduct);
//   res.redirect("/");
// });

module.exports = router;
