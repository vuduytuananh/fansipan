var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var product_priceSchema = new Schema({
  product_Id:{
    type: Schema.Types.ObjectId,
    required: true
  },
  price:{
    type: String,
    require: true
  }
});
var pricePolicySchema = new Schema({
  name:{
    type: String,
    required: true,
    unique: true
  },
  details:[product_priceSchema]
});

var PricePolicy = mongoose.model("price_policy", pricePolicySchema);
module.exports = PricePolicy;
module.exports.createNewPolicy = function(newPolicy, callback){
  newPolicy.save(callback);
}
module.exports.getAllPolicies = function(callback){
  PricePolicy.find({}).populate({
    path: "details.product_Id",
    model: "product",
    select: "productId id"
  }).exec(callback);
}
module.exports.deletePolicyByName = function(name,callback){
  PricePolicy.findOneAndRemove({name: name},callback);
}
module.exports.getPolicyById = function(id, callback){
  PricePolicy.findById(id , callback);
}
module.exports.updatePolicyById = function(id, policy, callback){
  PricePolicy.findOneAndUpdate({_id: id}, policy, callback);
}
module.exports.getAllPolicyNames = function(callback){
  PricePolicy.find({}).select("id name").exec(callback);
}
