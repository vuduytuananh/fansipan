var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var productLineSchema = new Schema({
  productLineName: {
    type: String,
    required: true,
    unique: true,
  },
  products:[{type: Schema.Types.ObjectId, ref:"product"}]
});
var ProductLine = mongoose.model("productLine", productLineSchema);
module.exports = ProductLine;
module.exports.getByName = function(name, callback){
  ProductLine.findOne({productLineName: name}, callback);
}
module.exports.updateByName = function(name,update, callback){
  ProductLine.findOneAndUpdate({productLineName: name}, update, callback);
}
module.exports.createNewProductLine = function(newProductLine, callback){
  newProductLine.save(callback);
}
module.exports.deleteById = function(id, callback){
  ProductLine.findOneAndRemove({_id: id},callback);
}
module.exports.getAllProducts = function(callback){
  ProductLine.find({}).populate({
    path: "products",
    model: "product",
    select: "id productId productName productPicture"
  }).exec(function(err,products){
      callback(err,products);
  });
}
