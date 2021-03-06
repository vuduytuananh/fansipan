var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ProductLine = require("./productLine");
var fs = require("fs");
var kvSchema = new Schema({
  field: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
});
var ProductSchema = new Schema({
    productLine: {
      type: String,
      required: true
    },
    productName: {
      type: String,
      unique: true,
      required: true
    },
    productPicture: {
      type: String,
      unique: true,
      required: true
    },
    productId: {
      type: String,
      unique: true,
      required: true
    },
    state:{
      type: String,
      required: true,
      default: "Unavailable"
    },
    productSpecs: [kvSchema],
    productDescription: String
});
var Product = mongoose.model("product", ProductSchema);
module.exports = Product;
module.exports.createNewProduct = function(newProduct, callback){
  newProduct.save(function(err, result){
    if(err){
      callback(err);
    }else{
      ProductLine.getByName(newProduct.productLine, function(err,productLine){
        if(err){
          callback(err);
        }else{
          if(productLine){
            products = productLine.products.concat([newProduct._id]);
            ProductLine.updateByName(newProduct.productLine, {products: products}, callback);
          }else{
            var newProductLine = new ProductLine({
              productLineName: newProduct.productLine,
              products: [newProduct._id]
            });
            ProductLine.createNewProductLine(newProductLine, callback);
          }
        }
      })
    }
  });
}
module.exports.activateProductById = function(id, callback){
  Product.findOneAndUpdate({_id: id}, {state : "Activated"}, callback);
}
module.exports.deactivateProductById = function(id, callback){
  Product.findOneAndUpdate({_id: id}, {state : "Unavailable"}, callback);
}
module.exports.getAllProducts = function(callback){
  Product.find({},callback);
}
module.exports.getProductById = function(id, callback){
  Product.findById(id, callback);
}
module.exports.updateByProductId = function(productId, newdata, callback){
  Product.findOneAndUpdate({productId: productId}, newdata, callback);
}
module.exports.getAllProducts = function(proj, callback){
  Product.find({},proj, callback);
}
