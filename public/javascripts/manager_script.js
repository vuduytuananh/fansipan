$(document).ready(function(){
  $("#submit_button").click(function(){
    $.ajax({
        url: '/manager/login',
        type: 'POST',
        success: function(data, textStatus, jqXHR){
              if (data.redirect){
                  window.location = data.redirect;
                }
              },
        contentType: 'application/json',
        data: JSON.stringify({username: $("#username").val(), password: $("#password").val()})
      });
  });
});
