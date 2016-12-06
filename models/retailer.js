var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ContactSchema = new Schema({
  type: {
    type: String
  },
  value: {
    type: String
  }
});
var RetailerSchema = new Schema({
  nameAndAddress:{
    type: String,
    unique: true
  },
  FRID:{
    type: String,
    unique: true,
    require: true
  },
  password:{
    type: String,
    required: true
  },
  contacts : [ContactSchema],
  email: {
    type: String
  },
  currentBalance: {
    type: Number
  },
  latestOrder: {
    type: Date
  },
  averagePerWeek: {
    type: Number
  },
  last4Weeks: {
    type: Number
  },
  status:{
    type: String,
    required: true,
    default: "Active"
  },
  applicable_price_policies:[Schema.Types.ObjectId]
});

var Retailer = mongoose.model("retailer",RetailerSchema);
// do not need to hash password for retailers
module.exports = Retailer;
module.exports.createRetailer = function(retailer, callback){
  retailer.save(callback);
}
module.exports.getRetailerByName = function(name, callback){
  Retailer.findOne({name: name}, callback);
}
module.exports.getAllRetailers = function(callback){
  Retailer.find({},"_id nameAndAddress FRID currentBalance lastMonthBalance",callback);
}
module.exports.comparePassword = function(password, storedPassword, callback){
  if(password === storedPassword){
    callback(null, true);
  }else{
    callback(null, false);
  }
}
module.exports.getRetailerByFRID = function(FRID, callback){
  Retailer.findOne({FRID: FRID}, callback);
}
module.exports.getRetailerById = function(id, callback){
  Retailer.findById(id).populate({
    path: "applicable_price_policies",
    model: "price_policy",
    select: "name"
  }).exec(callback);
}
module.exports.getRetailerByIdWithProj = function(id, proj, callback){
  Retailer.findById(id, proj, callback);
}
module.exports.deleteById = function(id, callback){
  Retailer.findOneAndRemove({_id : id}, callback);
}
module.exports.updateById = function(id,data, callback){
  Retailer.findOneAndUpdate({_id : id},data, callback);
}
