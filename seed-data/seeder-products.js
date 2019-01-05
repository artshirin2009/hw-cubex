const mongoose = require("mongoose");
var Product = require("../models/products");

mongoose.connect(
  `mongodb://localhost:27017/hw-cubex`,
  {
    useNewUrlParser: true
  },
  function(err) {
    if (err) throw err;

    console.log("Successfully connected");
  }
);

var products = [
  new Product({
    imagePath:
      "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/5887/5887139_sd.jpg;maxHeight=200;maxWidth=300",
    title: "Far Cry 5 - PlayStation 4",
    description:
      "You're in charge of the Horizon Festival. Customize everything, hire and fire your friends, and explore Australia in over 350 of the world's greatest cars. Make your Horizon the ultimate celebration of cars, music, and freedom of the open road. How you get there is up to you.",
    price: "59.99"
  }),
  new Product({
    imagePath:
      "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/8383/8383097_sd.jpg;maxHeight=200;maxWidth=300",
    title: "DOOM - PlayStation 4",
    description:
      "You're in charge of the Horizon Festival. Customize everything, hire and fire your friends, and explore Australia in over 350 of the world's greatest cars. Make your Horizon the ultimate celebration of cars, music, and freedom of the open road. How you get there is up to you.",
    price: "19.99"
  }),
  new Product({
    imagePath:
      "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/9276/9276473_sa.jpg;maxHeight=200;maxWidth=300",
    title: "Call of Duty: Modern Warfare 2 - Xbox 360",
    description:
      "You're in charge of the Horizon Festival. Customize everything, hire and fire your friends, and explore Australia in over 350 of the world's greatest cars. Make your Horizon the ultimate celebration of cars, music, and freedom of the open road. How you get there is up to you.",
    price: "49.99"
  }),
  new Product({
    imagePath:
      "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/5321/5321600_sd.jpg;maxHeight=200;maxWidth=300",
    title: "Forza Horizon 3 - Xbox One",
    description:
      "You're in charge of the Horizon Festival. Customize everything, hire and fire your friends, and explore Australia in over 350 of the world's greatest cars. Make your Horizon the ultimate celebration of cars, music, and freedom of the open road. How you get there is up to you.",
    price: "39.99"
  })
];
var done = 0;
for (var i = 0; i < products.length; i++) {
  products[i].save(function(err, result) {
    done++;
    if (done === products.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
  console.log("Ok");
}
