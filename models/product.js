var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ProductLine = require("./productLine");
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
module.exports.deleteProductById = function(id, callback){
  Product.findById(id, function(err, product){
    if(err){
      console.log(err);
      callback(err);

    }else{
      ProductLine.getByName(product.productLine, function(err,productLine){
        if(err){
          console.log(err);
          callback(err);
        }else{
          if(productLine){
            var index = productLine.products.indexOf(product.id);
            if(index > -1){
                productLine.products.splice(index, 1);
            }
            if(productLine.products.length === 0){
              ProductLine.deleteById(productLine.id, function(err, result){
                if(err){
                  console.log(err);
                  callback(err);
                }
              })
            }else{
              ProductLine.updateByName(product.productLine, {products: productLine.products}, function(err,result){
                if(err){
                  console.log(err);
                  callback(err);
                }
              });
            }
            Product.findOneAndRemove({_id: id}, callback);
          }
        }
      })
    }
  });
}
module.exports.getAllProducts = function(callback){
  Product.find({},callback);
}
module.exports.getProductById = function(id, callback){
  Product.findById(id, callback);
}
module.exports.getAllProducts = function(proj, callback){
  Product.find({},proj, callback);
}
