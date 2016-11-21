var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var ManagerSchema = mongoose.Schema({
  usertype:{
    type: String,
    required: true
  },
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    unique: true,
    required: true
  },
  position:{
    type: String,
    required: true
  },
  username:{
    type: String,
    unique: true,
    required: true
  },
  password:{
    type: String,
    required: true
  }
});
var Manager = mongoose.model("manager", ManagerSchema);
module.exports = Manager;
module.exports.createManager = function(manager, callback){
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(manager.password, salt, function(err, hash) {
        // Store hash in your password DB.
        if(err){
          return callback(err, null);
        }else{
        manager.password = hash;
        manager.save(callback);
        }
    });
  });
}
module.exports.getManagerByName = function(name, callback){
  Manager.findOne({name: name}, callback);
}
module.exports.findAll = function(callback){
  Manager.find({},callback);
}
module.exports.comparePassword = function(password, hash, callback){
  bcrypt.compare(password, hash, callback);
}
module.exports.getManagerById = function(id, callback){
  Manager.findById(id, callback);
}
module.exports.deleteById = function(id, callback){
  Manager.findOneAndRemove({_id : id}, callback);
}
module.exports.updateById = function(id,data, callback){
  Manager.findOneAndUpdate({_id : id},data, callback);
}
