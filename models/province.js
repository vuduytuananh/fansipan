var mongoose = require("mongoose");
var Retailer = require("./retailer");
var Schema = mongoose.Schema;
var districtSchema = new Schema({
  district_name:{
    type: String,
    unique: true,
    required: true
  },
  retailers:[{type: Schema.Types.ObjectId, ref: "retailer"}]
});
var provinceSchema = new Schema({
  province:{
    type: String,
    unique: true,
    required: true,
  },
  map: {
    type: String,
    unique: true,
    required: true
  },
  districts: [districtSchema]
});
var Province = mongoose.model("province",provinceSchema);
module.exports = Province;
module.exports.getAllRetailers = function(callback){
  Province.find({})
  .populate({
     path: 'districts.retailers',
     model: "retailer",
     select: "id nameAndAddress FRID"
  }).select("province districts").exec(function(err, provinces){
    callback(err, provinces);
  });
}
module.exports.getAllProvinces = function(callback){
  Province.find({}).select("id province").exec(callback);
}
module.exports.getProvinceById = function(id, callback){
  Province.findById(id).populate({
    path: 'districts.retailers',
    model: "retailer",
    select: "id nameAndAddress contacts"
  }).exec(callback);
}
