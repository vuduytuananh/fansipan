var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var paymentSchema = new Schema({
  retailer:{
    type: Schema.Types.ObjectId
  },
  paymentDate:{
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  note: String
});
var Payment = mongoose.model("payment", paymentSchema);
module.exports = Payment;
