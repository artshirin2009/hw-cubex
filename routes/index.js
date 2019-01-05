var express = require("express");
var router = express.Router();
var Product = require("../models/products");
/* GET home page. */

router.get("/", function(req, res, next) {
  Product.find().then(function(doc) {
    res.render("shop/index", {
      products: doc
    });
  });
});

module.exports = router;
