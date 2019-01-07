const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  cart: {
    type: Object,
    required: true
  },
  adress: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  paymantId: {
    type: String,
    required: true
  },
  totalPrice: {
    type: String
  }
});

module.exports = mongoose.model("Order", schema);
