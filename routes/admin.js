var express = require("express");
var router = express.Router();

var multer = require("multer");
const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./public/uploads/");
  },
  filename: function(req, file, callback) {
    callback(null, file.originalname);
  }
});
var upload = multer({ storage: storage });

const mongoose = require("mongoose");
var passport = require("passport");

var User = require("../models/users");
var Order = require("../models/order");
var Product = require("../models/products");

var checking = require("../config/checking");
var checkingisAdmin = require("../config/chekingIsAdmin");

/**Sign Up (Registration)*/

/**Add products page (only for admin) *image is a file*/
router.get("/add-product", checkingisAdmin, function(req, res, next) {
  res.render("shop/add-product", {});
});

router.post(
  "/shop/add-product",
  checkingisAdmin,
  upload.single("imageFile"),
  function(req, res, next) {
    var product = {
      _id: new mongoose.Types.ObjectId(),
      imagePath: req.file.path.slice(7),
      title: req.body.title,
      description: req.body.description,
      price: req.body.price
    };
    var newProduct = new Product(product);

    newProduct.save();
    res.redirect("/");
  }
);
/**Deleting products (only for admin) */
router.get("/delete/:id", checkingisAdmin, function(req, res, next) {
  var id = req.params.id;
  Product.findByIdAndRemove(id).exec();
  res.redirect("/");
});
/**Editing products (only for admin) */
router.get("/edit/:id", checkingisAdmin, function(req, res, next) {
  var productId = req.params.id;
  Product.findById(productId, function(err, product) {
    if (err) {
      console.log(err);
    }
    res.render("admin/edit-product", {
      product
    });
  });
});

router.post(
  "/edit-product",
  checkingisAdmin,
  upload.single("imageFile"),
  function(req, res, next) {
    var productId = req.body.id;
    Product.findById(productId, function(err, product) {
      if (err) {
        console.log(err);
      }
      if (req.file) {
        product.imagePath = req.file.path.slice(7);
      }
      if (req.body.title) {
        product.title = req.body.title;
      }
      if (req.body.description) {
        product.description = req.body.description;
      }
      if (req.body.price) {
        product.price = req.body.price;
      }
      product.save();
    });
    res.redirect("/");
  }
);

/**Get Authorized users */
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
/**Get All orders*/
router.get("/all-orders", checking, function(req, res, next) {
  Order.find({}, function(err, docs) {
    if (err) {
      console.log(err);
    }
    res.render("admin/all-orders", {
      orders: docs.reverse()
    });
  });
});
module.exports = router;
