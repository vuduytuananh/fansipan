//dependencies
var express = require("express");
var bodyParser = require("body-parser");
var passport = require("passport");
var mongoose = require("mongoose");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var path = require("path");
var connectMongo = require("connect-mongo");
var validator = require("express-validator");
var logger = require("morgan");
var MongoStore = connectMongo(session);
var LocalStrategy = require("passport-local").Strategy;
global.appRoot = path.resolve(__dirname);
//models
var adminProfile = require("./models/admin");
var Manager = require("./models/manager");
var Retailer = require("./models/retailer");

//routes required
var routes = require('./routes/index');
var users = require('./routes/users');
var gioithieu = require('./routes/gioithieu');
var banghepatio = require('./routes/banghepatio');
var phanphoi = require('./routes/phanphoi');
var lienhe = require('./routes/lienhe');
var sitemap = require('./routes/sitemap');
var banghekite = require('./routes/banghekite');
var catalogue = require('./routes/catalogue');
var messagePost = require('./routes/messagePost');
var admin = require("./routes/saleRoutes/admin");
var manager = require("./routes/saleRoutes/manager");

//get express app
var app = express();
//app set up
mongoose.connect("mongodb://localhost/fansipan");
app.set("port", (process.env.PORT || 3000));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
//middlewares
app.use(express.static("public"));
app.use(cookieParser("FanSiPanSessionKey"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.raw());
app.use(validator());
app.use(session({
  secret: (process.env.SESSION_KEY || "FanSiPanSessionKey"),
  saveUninitialized: false,
  resave: false,
  // cookie:{
  //   secure: "auto"
  // },
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());

//passport setup
passport.use("admin", new LocalStrategy(
  function(username, password, done) {
    if(adminProfile.adminName !== username){
      return done(null, false, {message: "Incorrect username"});
    }
    if(adminProfile.password !== password){
      return done(null, false, {message: "Incorrect password"});
    }
    return done(null, adminProfile);
  }
));
passport.use("manager", new LocalStrategy(
  function(managername, password, done) {
    Manager.getManagerByName(managername, function(err,manager){
      if(err) return done(err);
      if(!manager) return done(null,false, {message:"Incorrect username"});
      Manager.comparePassword(password, manager.password, function(err,isMatch){
        if(err) return done(err);
        if(!isMatch){
          return done(null, false, {message: "Incorrect Password"});
        }else{
          return done(null, manager);
        }
      });
    })
  }
));
passport.use("retailer", new LocalStrategy(
  function(FRID, password, done){
    Retailer.getRetailerByFRID(FRID, function(err, retailer){
      if(err) return done(err);
      if(!retailer){
        return done(null, false, {message: "Incorrect FRID"});
      }else{
        Retailer.comparePassword(password, retailer.password, function(err,isMatch){
          if(err) return done(err);
          if(!isMatch){
            return done(null, false, {message: "Incorrect Password"});
          }else{
            return done(null, retailer);
          }
        });
      }
    });
  }
));
passport.serializeUser(function(user, done) {
  done(null, {id: user.id, usertype: user.usertype});
});

passport.deserializeUser(function(stored, done) {
  switch (stored.usertype) {
    case "admin":
      if(adminProfile.id === stored.id){
        done(null, adminProfile);
      }else{
        done(null,null);
      }
      break;
    case "manager":
      Manager.getManagerById(stored.id, function(err,manager){
        done(err, manager);
      });
      break;
    case "retailer":
      Retailer.getRetailerById(stored.id, function(err, retailer){
        done(err, retailer);
      });
    default: done(null,null);
  }
});
//use development
app.use(logger("dev"));

//routes middlewares
//normal routes
app.use('/', routes);
app.use('/users', users);
app.use('/gioithieu', gioithieu);
app.use('/ban-ghe-patio', banghepatio);
app.use('/phanphoi', phanphoi);
app.use('/lienhe', lienhe);
app.use('/sitemap', sitemap);
app.use('/ban-ghe-kite', banghekite);
app.use('/catalogue', catalogue);
app.use('/messagePost', messagePost);
//sale routes
app.use("/admin", admin);
app.use("/manager", manager);
//listen
app.listen(app.get("port"));
