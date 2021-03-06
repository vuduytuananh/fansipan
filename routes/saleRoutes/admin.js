var express = require("express");
var passport = require("passport");
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var sharp = require("sharp");
var LocalStrategy = require("passport-local").Strategy;
var router = express.Router();
//models
var Manager = require("../../models/manager");
var Retailer = require("../../models/retailer");
var Province = require("../../models/province");
var Product = require("../../models/product");
var ProductLine = require("../../models/productLine");
var PricePolicy = require("../../models/pricePolicy");
var authorize = require("../../ulti/authorize");
var authorizeAdmin = authorize("admin","/admin/login");
var bcrypt = require("bcryptjs");
var adminFunctions = require("../../ulti/admin_functions");

function sendEmail(fromEmail,toEmail,subject,title,data, callback){
  var helper = require('sendgrid').mail;
  var from_email = new helper.Email(fromEmail);
  var to_email = new helper.Email(toEmail);
  var contentHTML = "<h3>"+title+"</h3>";
  data.forEach(function(piece){
    contentHTML += '<p><strong>'+ piece.fieldName +'</strong> ' + piece.value + '</p>';
  });
  var content = new helper.Content('text/html', contentHTML);
  var mail = new helper.Mail(from_email, subject, to_email, content);
  var sg = require('sendgrid')(process.SENDGRIDKEY);
  var request = sg.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: mail.toJSON(),
  });

  sg.API(request, callback);
}
//admin/login
router.get("/login", function(req,res){
  if(req.user){
    res.redirect("/admin");
  }else {
    res.render("saleViews/template",{
      pageTitle: "Quản trị",
      type: "admin",
      left:{
        temp_name: "login_form",
        data: {}
      },
      right:{
        temp_name: "blank",
        title: "",
        data: {}
      }
    });
  }
});
router.post("/login", passport.authenticate("admin"), function(req,res){
  res.json({redirect: "/admin"});
});
//admin
router.get("/", authorizeAdmin, function(req,res){
  res.render("saleViews/template", {
    pageTitle: "Quản trị",
    type: "admin",
    left:{
      temp_name: "functions",
      data: {
        functions: adminFunctions,
        active: "/admin"
      }
    },
    right:{
      temp_name: "blank",
      title: "Báo cáo tổng hợp",
      data: {}
    }
  });
});
//admin/managers
router.get("/managers",authorizeAdmin, function(req,res, next){
    Manager.findAll(function(err, result){
      if(err){
        next(err);
      }else{
      res.render("saleViews/template", {
        pageTitle: "Quản trị",
        type: "admin",
        left:{
          temp_name: "functions",
          data: {
            functions: adminFunctions,
            active: "/admin/managers"
          }
        },
        right:{
          temp_name: "admin_content_manager",
          title: "Thông tin tài khoản Manager",
          data: result
        }
      });
    }});
});
router.get("/managers/add_manager",authorizeAdmin, function(req,res){
  res.render("saleViews/template", {
    pageTitle: "Quản trị",
    type: "admin",
    left:{
      temp_name: "functions",
      data: {
        functions: adminFunctions,
        active: "/admin/managers"
      }
    },
    right:{
      temp_name: "admin_add_manager",
      title: "Tạo tài khoản Manager",
      data: {}
    }
  });
});
router.delete("/managers/:id",authorizeAdmin, function(req,res){
  if(req.user){
    console.log(req.params.id);
    Manager.deleteById(req.params.id, function(err){
      res.json({redirect: "/admin/managers"});
    });
  }else{
    res.json({redirect:"/admin/login"});
  }
});
router.put("/managers/:id",authorizeAdmin, function(req,res){
  if(req.user){
    var id = req.body.id;
    var email = req.body.email;
    var position = req.body.position;
    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;
    var passwordRe = req.body.passwordRe;
    req.checkBody("email", "email is empty").notEmpty();
    req.checkBody("id", "id is empty").notEmpty();
    req.checkBody("name", "name is empty").notEmpty();
    req.checkBody("username", "username is empty").notEmpty();
    req.checkBody("position", "position is empty").notEmpty();
    req.checkBody("email", "Email is invalid").isEmail();
    req.checkBody("password", "passwords do not match").equals(passwordRe);
    var errors = req.validationErrors();
    if(!errors){
      Manager.getManagerById(id, function(err, manager){
        if(err){
          res.end("Lỗi tìm kiếm ID");
        }else{
          if(!manager){
            res.end("Manager ID khong ton tai");
          }else{
            var updatedManager = {
              name: name,
              username: username,
              position : position,
              password: "",
              email: email
            };
            if(password === ""){
              updatedManager.password = manager.password;
              Manager.updateById(id, updatedManager, function(err, result){
                if(err){
                  console.log(err);
                  res.end("Lỗi lưu Manager");
                }else{
                  sendEmail("fansipan_admin@ngoaithatfansipan.com",email,"Tài khoản Manager Ngoại thất Fansipan","Update thông tin tài khoản Manager",[
                    {fieldName:"Họ tên:", value: name},
                    {fieldName:"Vị trí:", value: position},
                    {fieldName:"Tên đăng nhập:", value: username},
                    {fieldName:"Mật khẩu:", value: "*không đổi*"},
                    {fieldName:"Truy cập: <a href='www.ngoaithatpansipan.com/manager'>www.ngoaithatpansipan.com/manager</a>", value: " để đăng nhập"}
                  ], function(error, response) {
                  if(error){
                    res.end("Đã lưu nhưng có lỗi gửi email đến chủ tài khoản Manager. Thông báo cho chủ tài khoản Manager bằng cách khác");
                  }else{
                    res.end("Tạo Manager thành công. Thông tin tài khoản Manager đã được gửi đến email: " + email);
                  }
                  });
                  res.json({redirect: "/admin/managers"});
                }
              });
            }else{
              bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                    // Store hash in your password DB.
                    if(err){
                      res.end("Lỗi lưu password, vui lòng thử lại");
                    }else{
                    updatedManager.password = hash;
                    Manager.updateById(id, updatedManager, function(err, result){
                      if(err){
                        console.log(err);
                        res.end("Lỗi lưu Manager");
                      }else{
                        sendEmail("fansipan_admin@ngoaithatfansipan.com",email,"Tài khoản Manager Ngoại thất Fansipan","Update thông tin tài khoản Manager",[
                          {fieldName:"Họ tên:", value: name},
                          {fieldName:"Vị trí:", value: position},
                          {fieldName:"Tên đăng nhập:", value: username},
                          {fieldName:"Mật khẩu:", value: password},
                          {fieldName:"Truy cập: <a href='www.ngoaithatpansipan.com/manager'>www.ngoaithatpansipan.com/manager</a>", value: " để đăng nhập"}
                        ], function(error, response) {
                        if(error){
                          res.end("Đã lưu nhưng có lỗi gửi email đến chủ tài khoản Manager. Thông báo cho chủ tài khoản Manager bằng cách khác");
                        }else{
                          res.end("Tạo Manager thành công. Thông tin tài khoản Manager đã được gửi đến email: " + email);
                        }
                        });
                        res.json({redirect: "/admin/managers"});
                      }
                    });
                    }
                });
              });
            }
          }
        }
      });
    }else{
      res.end("Không thành công! Có thể do giá trị nhập vào bị trống hoặc không hợp lệ!");
    }
  }else{
    res.json({redirect:"/admin/login"});
  }
});
router.post("/managers/add_manager",authorizeAdmin, function(req,res){
  function startWithLoggedIn(){
    var email = req.body.email;
    var position = req.body.position;
    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;
    var passwordRe = req.body.passwordRe;

    req.checkBody("email", "email is empty").notEmpty();
    req.checkBody("name", "name is empty").notEmpty();
    req.checkBody("username", "username is empty").notEmpty();
    req.checkBody("password", "password is empty").notEmpty();
    req.checkBody("passwordRe", "passwordRe is empty").notEmpty();
    req.checkBody("position", "position is empty").notEmpty();
    req.checkBody("email", "Email is invalid").isEmail();
    req.checkBody("password", "passwords do not match").equals(passwordRe);
    var errors = req.validationErrors();
    if(!errors){
      var manager = new Manager({
        usertype: "manager",
        name: name,
        username : username,
        email: email,
        password: password,
        position: position
      });
      Manager.createManager(manager ,function(err){
        if(err){
          res.end("Không thành công! Có thể do tên đăng nhập hoặc email đã tồn tại!")
        }else{
          sendEmail("fansipan_admin@ngoaithatfansipan.com",email,"Tài khoản Manager Ngoại thất Fansipan","Thông tin tài khoản Manager mới",[
            {fieldName:"Họ tên:", value: name},
            {fieldName:"Vị trí:", value: position},
            {fieldName:"Tên đăng nhập:", value: username},
            {fieldName:"Mật khẩu:", value: password},
            {fieldName:"Truy cập: <a href='www.ngoaithatpansipan.com/manager'>www.ngoaithatpansipan.com/manager</a>", value: " để đăng nhập"}
          ], function(error, response) {
          if(error){
            res.end("Đã lưu nhưng có lỗi gửi email đến chủ tài khoản Manager. Thông báo cho chủ tài khoản Manager bằng cách khác");
          }else{
            res.end("Tạo Manager thành công. Thông tin tài khoản Manager đã được gửi đến email: " + email);
          }
          });
        }
      });
    }else{
      res.end("Không thành công! Có thể do giá trị nhập vào bị trống hoặc không hợp lệ!");
    }
  }
  if(req.user){
    startWithLoggedIn();
  }else{
    res.json({redirect:"/admin/login"});
  }
});
//admin/retailers
// router.get("/retailers", authorizeAdmin, function(req,res){
//   Retailer.getAllRetailers(function(err,retailers){
//     if(err){
//       res.end("lỗi getAllRetailers, truy cập lại sau");
//     }else{
//       res.render("saleViews/template",{
//         pageTitle: "Quản trị",
//         type: "admin",
//         left:{
//           temp_name: "functions",
//           data: {
//             functions: adminFunctions,
//             active: "/admin/retailers"
//           }
//         },
//         right:{
//           temp_name: "retailer_general",
//           title: "Thông tin nhà phân phối",
//           data: {
//           retailers : retailers,
//           format: function(date){
//               var dd = date.getDate();
//               var mm = date.getMonth()+1; //January is 0!
//               var yyyy = date.getFullYear();
//               if(dd<10){
//                 dd='0'+dd
//               }
//               if(mm<10){
//                   mm='0'+mm
//               }
//               var date = dd+'/'+mm+'/'+yyyy;
//               return date;
//             }
//           }
//         }
//       });
//     }
//   });
// });
router.get("/retailers", authorizeAdmin, function(req,res){
  Province.getAllRetailers(function(err,result){
    if(err){
      res.end("Lỗi getAllRetailers in Province");
    }else{
      res.render("saleViews/template", {
        pageTitle: "Quản trị",
        type: "admin",
        left:{
          temp_name: "functions",
          data: {
            functions: adminFunctions,
            active: "/admin/retailers"
          }
        },
        right:{
          temp_name: "province",
          title: "Thông tin nhà phân phối",
          data: result.reverse()
        }
      })
    }
  });
});
router.get("/retailers/add_retailer", authorizeAdmin, function(req,res){

});
router.get("/retailers/:id", authorizeAdmin, function(req,res){
  PricePolicy.getAllPolicyNames(function(err,names){
    if(err){
      res.end("Lỗi tìm Price Policy Names");
    }else{
      Retailer.getRetailerById(req.params.id, function(err,retailer){
        if(err){
          res.end("lỗi tìm nhà phân phối");
        }else{
          retailer.pricePolicyNames = names;
        res.render("saleViews/template", {
          pageTitle: "Quản trị",
          type: "admin",
          left:{
            temp_name: "functions",
            data: {
              functions: adminFunctions,
              active: "/admin/retailers"
            }
          },
          right:{
            temp_name: "admin_update_retailer",
            title: "Thông tin chi tiết nhà phân phối",
            data: retailer
          }
        });
      }
      });
    }
  });
});
router.post("/retailers/add_retailer", authorizeAdmin, function(req,res){

});
router.delete("/retailers/:id", authorizeAdmin, function(req,res){

});
router.put("/retailers/:id", authorizeAdmin, function(req,res){

});
//admin/products
router.get("/products/add", authorizeAdmin, function(req,res){
  ProductLine.getAllProductsLinesNames(function(err, names){
    if(err){
      res.end("Lỗi tìm tên dòng sản phẩm");
    }else{
    res.render("saleViews/template", {
      pageTitle: "Quản trị",
      type: "admin",
      left:{
        temp_name: "functions",
        data: {
          functions: adminFunctions,
          active: "/admin/products"
        }
      },
      right:{
        temp_name: "admin_add_product",
        title: "Thêm sản phẩm",
        data: names
      }
    });
  }
});
});
router.post("/products/update", authorizeAdmin, function(req,res){
  if(req.body.productPicture === ""){
    delete req.body.productPicture;
  }else{
    req.body.productPicture = "/uploads/processed/" + req.body.productId + req.body.productPicture;
  }
  Product.updateByProductId(req.body.productId, req.body, function(err, result){
    if(err){
      res.end("OK");
      return;
    }
    if(req.body.productPicture){
      res.end("upload pic");
    }else{
      res.end("OK");
    }
  })
});
router.get("/products/:id", authorizeAdmin, function(req,res){
    Product.getProductById(req.params.id, function(err, product){
      if(err){
        res.redirect("/admin/products");
        return;
      }
      if(!product){
        res.redirect("/admin/products");
        return;
      }
      res.render("saleViews/template", {
        pageTitle: "Quản trị",
        type: "admin",
        left:{
          temp_name: "functions",
          data: {
            functions: adminFunctions,
            active: "/admin/products"
          }
        },
        right:{
          temp_name: "admin_update_product",
          title: "Sửa thông tin sản phẩm",
          data: product
        }
      });

    });
});
router.post("/products/addProduct", authorizeAdmin, function(req,res){
  var productLine = req.body.productLine;
  var productName = req.body.productName;
  var productId = req.body.productId;
  var productPicture = req.body.productPicture;
  var productDescription = req.body.productDescription;
  var productSpecs = req.body.productSpecs;
  req.checkBody("productName", "productName is empty").notEmpty();
  req.checkBody("productLine", "productLine is empty").notEmpty();
  req.checkBody("productDescription", "productDescription is empty").notEmpty();
  req.checkBody("productId", "productId is empty").notEmpty();
  req.checkBody("productSpecs", "productSpecs is empty").notEmpty();
  var errors = req.validationErrors();
  if(!errors){
    var newProduct = new Product({
      productLine: productLine,
      productName: productName,
      productId: productId,
      productPicture: "/uploads/processed/"+productId+productPicture,
      productDescription: productDescription,
      productSpecs: productSpecs
    });
    Product.createNewProduct(newProduct, function(err, result){
      if(err){
        console.log(err);
        res.end("Lỗi lưu sản phẩm, ID hoặc thông số không phải là giá trị duy nhất hoặc bị trống!")
      }else{
        res.end("upload pic");
      }
    });
  }else{
  res.end("Không thành công! Phát hiện giá trị bỏ trống");
  }
});
router.post("/products/addPic", authorizeAdmin, function(req,res){
  var form = new formidable.IncomingForm();
  var filename = "";
  form.multiples = false;
  form.uploadDir = path.join(appRoot, 'public/uploads');
  form.on('file', function(field, file) {
    filename = file.name;
    fs.rename(file.path, path.join(form.uploadDir, filename));
  });
  form.on('error', function(err) {
    res.end("Đã lưu thông tin sản phẩm nhưng có lỗi lưu ảnh sản phẩm, sửa lại sau!");
  });
  form.on('end', function() {
    //update
    fs.readdir(appRoot + "/public/uploads/processed/", function(err, files){
      if(files){
      files.forEach(function(file){
        if(filename.substring(0,filename.lastIndexOf(".") + 1) === file.substring(0,filename.lastIndexOf(".") + 1)){
          fs.unlink(appRoot + "/public/uploads/processed/" + file, function(err){
            console.log(err);
            sharp(appRoot + '/public/uploads/' + filename)
            .resize(320, 250)
            .background({r: 255, g: 255, b: 255, a: 100})
            .embed()
            .toFile(appRoot + '/public/uploads/processed/' + filename, function(err) {
              if(err){
                res.end("Đã lưu thông tin sản phẩm nhưng có lỗi lưu ảnh sản phẩm, sửa lại sau!");
                return;
              }else{
                fs.unlink(appRoot + '/public/uploads/' + filename, function(err){
                  console.log(err);
                  res.json({redirect:"/admin/products"});
                  return;
                });
              }
            });
          });
        }
      });
      }
    });
    fs.readdir(appRoot + "/public/uploads/processed/", function(err, files){
      if(files && files.every(function(i){
        return filename.substring(0,filename.lastIndexOf(".") + 1) !== i.substring(0,filename.lastIndexOf(".") + 1);
      })){
        sharp(appRoot + '/public/uploads/' + filename)
        .resize(320, 250)
        .background({r: 255, g: 255, b: 255, a: 100})
        .embed()
        .toFile(appRoot + '/public/uploads/processed/' + filename, function(err) {
          if(err){
            res.end("Đã lưu thông tin sản phẩm nhưng có lỗi lưu ảnh sản phẩm, sửa lại sau!");
            return;
          }else{
            fs.unlink(appRoot + '/public/uploads/' + filename, function(err){
              console.log(err);
              res.json({redirect:"/admin/products"});
              return;
            });
          }
        });
      }
  });
});
  form.parse(req);
});
router.get("/products/activate/:id", authorizeAdmin, function(req,res){
  Product.activateProductById(req.params.id, function(err, result){
    res.redirect("/admin/products");
  });
});
router.get("/products/deactivate/:id", authorizeAdmin, function(req,res){
  Product.deactivateProductById(req.params.id, function(err, result){
    res.redirect("/admin/products");
  });
});
router.get("/products", authorizeAdmin, function(req,res){
  ProductLine.getAllProducts(function(err,products){
    if(err){
      res.end("Lỗi tìm sản phẩm");
    }else{
      res.render("saleViews/template", {
        pageTitle: "Quản trị",
        type: "admin",
        left:{
          temp_name: "functions",
          data: {
            functions: adminFunctions,
            active: "/admin/products"
          }
        },
        right:{
          temp_name: "admin_content_products",
          title: "Thông tin sản phẩm",
          data: products
        }
      });
    }
  });
});
//admin/price-policy
router.get("/price-policy/add", authorizeAdmin, function(req,res){
  ProductLine.getAllProducts(function(err,products){
    if(err){
      res.end("Lỗi tìm sản phẩm");
    }else{
      res.render("saleViews/template", {
        pageTitle: "Quản trị",
        type: "admin",
        left:{
          temp_name: "functions",
          data: {
            functions: adminFunctions,
            active: "/admin/price-policy"
          }
        },
        right:{
          temp_name: "admin_content_price_policy",
          title: "Thêm chính sách giá",
          data: products
        }
      });
    }
  });
});
router.get("/price-policy/:id", authorizeAdmin, function(req,res){
  ProductLine.getAllProducts(function(err,products){
    if(err){
      res.end("Lỗi tìm sản phẩm");
      return;
    }else{
      PricePolicy.getPolicyById(req.params.id, function(err, policy){
        if(err || !policy){
          res.end("Lỗi tìm chính sách giá");
          return;
        }else{
          res.render("saleViews/template", {
            pageTitle: "Quản trị",
            type: "admin",
            left:{
              temp_name: "functions",
              data: {
                functions: adminFunctions,
                active: "/admin/price-policy"
              }
            },
            right:{
              temp_name: "admin_price_policy_by_name",
              title: "Chính sách giá",
              data: {products: products, policy: policy}
            }
          });
        }
      });
    }
  });
});
router.put("/price-policy", authorizeAdmin, function(req,res){
  req.body.details.forEach(function(product){
    var ok = product.price.split("").every(function(i){
      return "0123456789".indexOf(i) !== - 1;
    }) && product.price.charAt(0) !== "0" && product.price !== "";
    if(!ok){
      product.price = "#novalue";
    }else{
      product.price = "" + Number(product.price);
    }
  });
    PricePolicy.updatePolicyById(req.body.id, {details: req.body.details}, function(err,result){
      if(err){
        console.log(err);
      }
      res.json({redirect:"/admin/price-policy"});
    })
})
router.post("/price-policy", authorizeAdmin, function(req,res){
  req.body.details.forEach(function(product){
    var ok = product.price.split("").every(function(i){
      return "0123456789".indexOf(i) !== - 1;
    }) && product.price.charAt(0) !== "0" && product.price !== "";
    if(!ok){
      product.price = "#novalue";
    }else{
      product.price = "" + Number(product.price);
    }
  });
  if(req.body.name === ""){
    res.end("Tên chính sách không hợp lệ!");
    return;
  }else{
    var newPricePolicy = new PricePolicy(req.body);
    PricePolicy.createNewPolicy(newPricePolicy, function(err, result){
      if(err){
        console.log(err);
        res.end("Lỗi lưu chính sách giá, có thể tên chính sách giá bị trùng, thử lại tên khác!");
        return;
      }else{
        res.json({redirect: "/admin/price-policy"});
        return;
      }
    })
  }
});
router.get("/price-policy", authorizeAdmin, function(req,res){
  PricePolicy.getAllPolicies(function(err, policies){
    if(err){
      res.end("Lỗi tìm chính sách giá");
    }else{
      res.render("saleViews/template", {
        pageTitle: "Quản trị",
        type: "admin",
        left:{
          temp_name: "functions",
          data: {
            functions: adminFunctions,
            active: "/admin/price-policy"
          }
        },
        right:{
          temp_name: "admin_price_policy",
          title: "Thông tin chính sách giá",
          data: policies
        }
      });
    }
  })
});
router.delete("/price-policy", authorizeAdmin, function(req,res){
  PricePolicy.deletePolicyByName(req.body.name, function(err,result){
    res.json({redirect: '/admin/price-policy'});
  });
});
//admin/logout

router.get("/logout",authorizeAdmin, function(req,res,next){
  req.logout();
  next();
},authorizeAdmin);

module.exports = router;
