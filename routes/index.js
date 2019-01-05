var express = require("express");
var router = express.Router();
var Product = require("../models/products");
var Cart = require("../models/cart");
/* GET home page. */

router.get("/", function(req, res, next) {
  Product.find().then(function(doc) {
    res.render("shop/index", {
      products: doc
    });
  });
});

/**Details page */
router.get("/details/:id", function(req, res, next) {
  var productId = req.params.id;
  req.session.oldUrl = req.url;
  Product.findById(productId, function(err, product) {
    console.log(product);
    res.render("shop/details-product", {
      product: product
    });
  });
});

router.get("/details/add-to-cart/:id", function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product) {
    cart.add(product, product.id);
    req.session.cart = cart;
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  });
});

router.get("/add-to-cart/:id", function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product) {
    cart.add(product, product.id);
    req.session.cart = cart;
    res.redirect("/");
  });
});

router.get("/cart", function(req, res, next) {
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  if (cart.totalQty < 1) {
    res.redirect("/");
  } else {
    res.render("shop/cart", {
      cart: cart.generateArray()
    });
  }
});

router.get("/cart/add-to-cart/:id", function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product) {
    cart.add(product, product.id);
    req.session.cart = cart;
    res.redirect("/cart");
  });
});
router.get("/cart/remove-one-from-cart/:id", function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product) {
    cart.remove(product, product.id);
    req.session.cart = cart;
    res.redirect("/cart");
  });
});
module.exports = router;
