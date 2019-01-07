var express = require("express");

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

var router = express.Router();

const mongoose = require("mongoose");
var Product = require("../models/products");
var Cart = require("../models/cart");

var checking = require("../config/checking");
var checkingisAdmin = require("../config/chekingIsAdmin");
/* GET home page. */

router.get("/", function(req, res, next) {
  console.log(req.user);
  var role;
  if (req.user !== undefined) {
    var role = req.user.role;
  } else {
    role = 0;
  }
  Product.find().then(function(doc, req) {
    console.log("role - " + role);
    res.render("shop/index", {
      role: role,
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
    res.redirect(oldUrl);
    req.session.oldUrl = null;
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

module.exports = router;
