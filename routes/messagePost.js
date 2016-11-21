var express = require('express');
var router = express.Router();
router.post('/', function(req, res, next) {

  var helper = require('sendgrid').mail;
  var from_email = new helper.Email('fansipan_message@ngoaithatfansipan.com');
  var to_email = new helper.Email('vuduytuananh@gmail.com');
  var subject = 'Tin nhắn qua website - ' + req.body.name;
  var content = new helper.Content('text/html', '<p><strong>Họ tên:</strong> ' + req.body.name + '</p><p><strong>Số điện thoại:</strong> '+req.body.phone+'</p><p><strong>Tin nhắn:</strong> ' + req.body.message +'</p>');
  var mail = new helper.Mail(from_email, subject, to_email, content);
  var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
  var request = sg.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: mail.toJSON(),
  });

sg.API(request, function(error, response) {
  if(error){
    res.end("ERROR");
  }else{
    res.end("OK");
  }
  });
});

module.exports = router;
