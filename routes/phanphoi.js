var express = require('express');
var router = express.Router();
var Province = require("../models/province");
/* GET gioi thieu page. */
router.get('/', function(req, res, next) {
  Province.getAllProvinces(function(err, provinces){
    if(err){
      console.log(err);
    }else{
      res.render("phanphoi", {data:provinces.reverse()});
    }
  });
});
router.get("/:id", function(req,res){
  Province.getProvinceById(req.params.id, function(err, province){
    if(err || !province){
      res.render("error");
    }else{
      res.render("phanphoi_province",{data: province});
    }
  })
});
module.exports = router;
