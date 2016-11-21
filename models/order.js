var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var productAmountSchema = new Schema({
  product_Id:{
    type: String
  },
  numberOfProducts {
    type: Number
  }
});
var orderSchema = new Schema({
  orderID:{
    type: String,
    unique: true
  },
  date:{
    type: Date,
    default: Date.now
  },
  status:{
    type: String,
    required: true
  },
  pricePolicy: {
    type: Schema.Types.ObjectId,
    required: true
  },
  amount: [productAmountSchema],
  total: {
    type: Number,
    required: true
  },
  note: String
});
var Order = mongoose.model("order", orderSchema);
module.exports = Order;
