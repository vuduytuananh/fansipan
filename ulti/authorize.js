function _redirect(req,res, redirect){
  if(req.method === "GET"){
    res.redirect(redirect);
  }else{
    res.json({redirect:redirect});
  }
}
module.exports = function(usertype, redirect){
  return function(req,res,next){
    if(req.user){
      if(req.user.usertype === usertype){
        next();
      }else{
        req.logout();
        _redirect(req,res, redirect);
      }
    }else{
      _redirect(req,res, redirect);
    }

}}
