var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var product_priceSchema = new Schema({
  product_Id:{
    type: Schema.Types.ObjectId,
    required: true
  },
  price:{
    type: Number,
    require: true
  }
});
var pricePolicySchema = new Schema({
  name:{
    type: String,
    required: true
  },
  details:[product_priceSchema]
});

var PricePolicy = mongoose.model("price_policy", pricePolicySchema);
module.exports = PricePolicy;
