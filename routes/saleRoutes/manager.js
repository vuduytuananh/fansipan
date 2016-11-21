var express = require("express");
var router = express.Router();
var passport = require("passport");
var bcrypt = require("bcryptjs");
var authorize = require("../../ulti/authorize");
var authorizeManager = authorize("manager", "/manager/login");
var Manager = require("../../models/manager");
var managerFunctions = require("../../ulti/manager_functions");

//manager login
router.get("/login", function(req,res){
  res.render("saleViews/template",{
    pageTitle: "Quản lí",
    type: "manager",
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
});
router.post("/login", passport.authenticate("manager",{session: true}), function(req,res){
  res.json({redirect: "/manager"});
});
//manager home if logged in --> pending orders, else --> login page
router.get("/",authorizeManager, function(req,res){
  res.render("saleViews/template",{
    pageTitle: "Quản lí",
    type: "manager",
    left:{
      temp_name: "functions",
      data: {
        functions: managerFunctions,
        active: "/manager"
      }
    },
    right:{
      temp_name: "blank",
      title: "",
      data: {}
    }
  });
});
//pending Orders
router.put("/change-order-status/:id",authorizeManager,function(req,res){

});
//manager On-delivery
router.get("/on-delivery",authorizeManager, function(req,res){
  res.end("On Delivery Page");
});
//manager completed Transactions
router.get("/completed-transaction",authorizeManager, function(req,res){
  res.end("Completed Transaction Page");
});
//manager payments
router.get("/payments",authorizeManager, function(req,res){
  res.end("Payment Page");
});
router.post("/payments",authorizeManager, function(req,res){

});
//manager Balance
router.get("/balance",authorizeManager, function(req,res){
  res.end("Balance Page");
});
//manager Retailers
router.get("/retailers",authorizeManager, function(req,res){
  res.end("Retailer Page");
});
router.get("/retailers/:id", authorizeManager, function(req,res){

});
//manager logout
router.get("/logout", authorizeManager, function(req,res,next){
  req.logout();
  next();
}, authorizeManager);

module.exports = router;
