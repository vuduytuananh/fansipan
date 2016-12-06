$(document).ready(function(){
  $("#add_product_spec").on('click', function(){
    $("#add_product").before('<div class="row">'+
      '<div class="col-xs-2 manager-label manager-field">'+
        '<a class="btn remove_product_spec"><span class="glyphicon glyphicon-minus-sign red" style="font-size: 24px;"></span></a>'+
      '</div>'+
      '<div class="col-xs-4 manager-field">'+
        '<form><div class="form-group"><input class="form-control" type="text" name="field" placeholder="Chỉ số"></div></form>'+
      '</div>'+
      '<div class="col-xs-4 manager-field">'+
        '<form><div class="form-group"><input class="form-control" type="text" name="value" placeholder="Giá trị"></div></form>'+
      '</div>'+
    '</div>');
  });
  $("#add_contact").on('click', function(){
    $("#add_product").before('<div class="row">'+
      '<div class="col-xs-2 manager-label manager-field">'+
        '<a class="btn remove_product_spec"><span class="glyphicon glyphicon-minus-sign red" style="font-size: 24px;"></span></a>'+
      '</div>'+
      '<div class="col-xs-4 manager-field">'+
        '<form><div class="form-group">'+
          '<div class="input-group">' +
          '<div class="input-group-btn">'+
        '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Chọn <span class="caret"></span></button>'+
        '<ul class="dropdown-menu">' +
          '<li><a href="#">mobile phone number</a></li>' +
          '<li><a href="#">telephone number</a></li>' +
          '<li><a href="#">address</a></li>' +
        '</ul>' +
      '</div><!-- /btn-group -->'+
      '<input type="text" class="form-control" id="product_line_name" disabled aria-label="...">'+
    '</div><!-- /input-group --></div>'+
    '</form>'+
      '</div>'+
      '<div class="col-xs-4 manager-field">'+
        '<form><div class="form-group"><input class="form-control" type="text" name="value"></div></form>'+
      '</div>'+
    '</div>');
  });
  $("#add_policy").on('click', function(){
    $("#add_policy_div").before('<div class="row">'+
      '<div class="col-xs-2 manager-label manager-field">'+
        '<a class="btn remove_product_spec"><span class="glyphicon glyphicon-minus-sign red" style="font-size: 24px;"></span></a>'+
      '</div>'+
      '<div class="col-xs-4 manager-field">'+
        '<form><div class="form-group">'+
          '<div class="input-group">' +
          '<div class="input-group-btn">'+
        '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Chọn <span class="caret"></span></button>'+
         '<ul class="dropdown-menu">' +
         $(this).parent().siblings("div").find('ul')[0].innerHTML+
         '</ul>'+
      '</div><!-- /btn-group -->'+
      '<input type="text" class="form-control" disabled aria-label="...">'+
    '</div><!-- /input-group --></div>'+
    '</form>'+
      '</div>'+
      '<div class="col-xs-4 manager-field">' +
        '<form><div class="form-group"><input class="form-control" disabled type="text" name="value" value=""></div></form>' +
      '</div>' +
    '</div>');
  });
  $("#retailer_policy").on('click','a.remove_product_spec',function(){
    $(this).closest('div[class="row"]').remove();
  });
  $(".policy_picker").on('click',function(){
    console.log($(this).innerHTML);
  });
  $("#product_specs").on('click','a.remove_product_spec',function(){
    $(this).closest('div[class="row"]').remove();
  });
  $("#sample_image_upload").change(function(){
    var reader = new FileReader();
    reader.onload = function (e) {
        // get loaded data and render thumbnail.
        document.getElementById("preview_upload_image").src = e.target.result;
    };
    // read the image file as a data URL.
    reader.readAsDataURL(this.files[0]);
  });

    $("#submit_button").click(function(){
      $.ajax({
          url: '/admin/login',
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
    $(".product_line_name_picker").click(function(){
      $("#product_line_name").attr("disabled","disabled");
      $("#product_line_name").val($(this).text());
    });
    $("#add_new_product_line_name").click(function(){
      $("#product_line_name").val("");
      $("#product_line_name").removeAttr("disabled");
      $("#product_line_name").focus();
    });
    $(".remove-button").click(function(){
      var id = $(this).parent().closest("div[class='row']").find("label[class ='manager_id']")[0].innerHTML;
      $.ajax({
          url: '/admin/managers/' + id,
          type: 'DELETE',
          success: function(data, textStatus, jqXHR){
                if (data.redirect){
                    window.location = data.redirect;
                  }
              },
          contentType: 'application/json'
        });

    });
    //remove message when focus
    $(".manager-field input").focus(function(){
      $("#validate_message").text("");
    });
    $(".update-product-button").click(function(){
      $("#validate_message").text("");
      var inputs = $(this).parent().parent().siblings("div.row").find("input");
      var productDescription = $(this).parent().parent().siblings("div.row").find("textarea")[0].value;
      var productSpecs = [];
      var productLine = inputs[0].value.trim();
      var productName = inputs[1].value.trim();
      var productId = inputs[2].value.trim();
      var productPicture = inputs[3].value.trim();
      for(var i = 4; i < inputs.length - 2;){
        var field =  inputs[i].value.trim();
        var value = inputs[i+1].value.trim();
        if(field === "" || value === ""){
          $("#validate_message").css("color","red");
          $("#validate_message").text("Không bỏ trống!");
          return;
        }
        productSpecs.push({
          field: field,
          value: value
        });
        i += 2;
      }
      if(productPicture.indexOf(".") !== -1){
        productPicture = productPicture.substring(productPicture.indexOf("."));
      }
      //not empty validate
      if(productDescription === "" || productName === "" || productId === "" || productSpecs.length === 0){
        $("#validate_message").css("color","red");
        $("#validate_message").text("Không bỏ trống!");
        return
      }
      //post by using ajax
      if(productPicture !== ""){
      var files = $("#sample_image_upload").get(0).files;
      if (files.length === 1){
        var formData = new FormData();
        var file = files[0];
        formData.append('image_upload', file, productId + productPicture);
      }
    }
      var metaData = {
        productLine: productLine,
        productName: productName,
        productId: productId,
        productDescription: productDescription,
        productPicture: productPicture,
        productSpecs: productSpecs
      }
      $.ajax({
          url: "/admin/products/update",
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(metaData),
          success: function(res){
            if(res === "upload pic" && productPicture !== ""){
              $.ajax({
              url: '/admin/products/addPic',
              type: 'POST',
              data: formData,
              processData: false,
              contentType: false,
              success: function(res){
                if (res.redirect){
                    window.location = res.redirect;
                }else{
                  $("#validate_message").css("color","red");
                  $("#validate_message").text(res);
                }
              }
            });
            }else{
              window.location = "/admin/products";
            }
          }
      });


    });
    $("#save_new_price_policy").click(function(){
      var data = {
        name: "",
        details: []
      };
      var price_policy_name = $("#new_price_policy_name").val();
      if(price_policy_name === ""){
        $("#new_price_policy_message").text("Nhập tên chính sách giá!");
        return;
      }else{
        data.name = price_policy_name;
      }
      var products = $(".product_price_data");
      for(var i = 0; i < products.length; i++){
        var id = $(products[i]).find("label[class ~= nodisplay]").text();
        var price = "" + $(products[i]).find("input").val();
        if(price.charAt(0) === "0" || price.indexOf(".") !== -1 || price.indexOf("-") !== -1 || price.indexOf("e") !== -1){
          $("#new_price_policy_message").text("Nhập giá đúng format!");
          return;
        }
        data.details.push({product_Id: id, price: price});
      }
      $.ajax({
          url: '/admin/price-policy',
          type: 'POST',
          success: function(res){
            if(res.redirect){
              window.location = res.redirect;
            }else{
              $("#new_price_policy_message").text(res);
            }
          },
          contentType: 'application/json',
          data: JSON.stringify(data)
        });
    });
    $("#update_price_policy").click(function(){
      var data = {
        id: $("#policy_id").text(),
        details: []
      };
      var products = $(".product_price_data");
      for(var i = 0; i < products.length; i++){
        var id = $(products[i]).find("label[class ~= nodisplay]").text();
        var price = "" + $(products[i]).find("input").val();
        if(price.charAt(0) === "0" || price.indexOf(".") !== -1 || price.indexOf("-") !== -1 || price.indexOf("e") !== -1){
          $("#new_price_policy_message").text("Nhập giá đúng format!");
          return;
        }
        data.details.push({product_Id: id, price: price});
      }
      $.ajax({
          url: '/admin/price-policy',
          type: 'PUT',
          success: function(res){
            if(res.redirect){
              window.location = res.redirect;
            }else{
              $("#new_price_policy_message").text(res);
            }
          },
          contentType: 'application/json',
          data: JSON.stringify(data)
        });
    });
    $(".remove-price-policy-button").click(function(){
      var policyName = $(this).parent().parent().find("h3").text();
      $.ajax({
          url: '/admin/price-policy',
          type: 'DELETE',
          success: function(res){
            if(res.redirect){
              window.location = res.redirect;
            }
          },
          contentType: 'application/json',
          data: JSON.stringify({name: policyName})
        });
    });
    $(".save-new-product-button").click(function(){
      $("#validate_message").text("");
      var inputs = $(this).parent().parent().siblings("div.row").find("input");
      var productDescription = $(this).parent().parent().siblings("div.row").find("textarea")[0].value;
      var productSpecs = [];
      var productLine = inputs[0].value.trim();
      var productName = inputs[1].value.trim();
      var productId = inputs[2].value.trim();
      var productPicture = inputs[3].value.trim();
      for(var i = 4; i < inputs.length - 2;){
        var field =  inputs[i].value.trim();
        var value = inputs[i+1].value.trim();
        if(field === "" || value === ""){
          $("#validate_message").css("color","red");
          $("#validate_message").text("Không bỏ trống!");
          return;
        }
        productSpecs.push({
          field: field,
          value: value
        });
        i += 2;
      }
      if(productPicture.indexOf(".") !== -1){
        productPicture = productPicture.substring(productPicture.indexOf("."));
      }else{
        productPicture = "";
      }
      //not empty validate
      if(productDescription === "" || productName === "" || productId === "" || productPicture === "" || productSpecs.length === 0){
        $("#validate_message").css("color","red");
        $("#validate_message").text("Không bỏ trống!");
        return
      }
      //post by using ajax
      var files = $("#sample_image_upload").get(0).files;
      if (files.length === 1){
        var formData = new FormData();
        var file = files[0];
        formData.append('image_upload', file, productId + productPicture);
      }
      var metaData = {
        productLine: productLine,
        productName: productName,
        productId: productId,
        productDescription: productDescription,
        productPicture: productPicture,
        productSpecs: productSpecs
      }
      $.ajax({
          url: '/admin/products/addProduct',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(metaData),
          success: function(res){
            if(res === "upload pic"){
              $.ajax({
              url: '/admin/products/addPic',
              type: 'POST',
              data: formData,
              processData: false,
              contentType: false,
              success: function(res){
                if (res.redirect){
                    window.location = res.redirect;
                }else{
                  $("#validate_message").css("color","red");
                  $("#validate_message").text(res);
                }
              }
            });
            }else{
              $("#validate_message").css("color","red");
              $("#validate_message").text(res);
            }
          }
      });


    });
    $(".save-new-manager-button").click(function(){
      var inputValue = $(this).parent().closest("div[class='row']").find("input[class!='manager-label']");
      var name = inputValue[0].value.trim();
      var email = inputValue[1].value.trim();
      var position = inputValue[2].value.trim();
      var username = inputValue[3].value.trim();
      var password = inputValue[4].value.trim();
      var passwordRe = inputValue[5].value.trim();
      //not Empty
      for(var i = 0; i < inputValue.length; i++){
        if(inputValue[i].value === ""){
            $("#validate_message").css("color","red");
            $("#validate_message").text("Điền đầy đủ thông tin!");
            return
        }
      }
      //email validate
      var indexOfAt = email.indexOf("@");
      var indexOfDot = email.lastIndexOf(".");
      if(indexOfAt === -1 || indexOfDot === -1 || indexOfDot === email.length - 1 || indexOfAt > indexOfDot){
        $("#validate_message").css("color","red");
        $("#validate_message").text("Nhập email hợp lệ!");
        return
      }
      //password match
      if(password !== passwordRe){
        $("#validate_message").css("color","red");
        $("#validate_message").text("Mật khẩu không trùng nhau");
        return
      }
      //validated
      var data = {
        name : name,
        email: email,
        position : position,
        username: username,
        password: password,
        passwordRe: passwordRe
      }
      $.ajax({
          url: '/admin/managers/add_manager',
          type: 'POST',
          success: function(res){
            $(".manager-field input").val("");
            $("#validate_message").css("color","green");
            $("#validate_message").text(res);
          },
          contentType: 'application/json',
          data: JSON.stringify(data)
        });

    });
    //update manager-field
    $(".update-button").click(function(){
      var inputValue = $(this).parent().closest("div[class='row']").find("input[class!='manager-label']");
      var nodisplays = $(this).parent().closest("div[class='row']").find("div[class ~= 'toggle']");
      var id = $(this).parent().closest("div[class='row']").find("label[class ~='manager_id']")[0].innerHTML;
      var message = $(this).parent().closest("div[class='row']").find("label[class ~= 'update_validate_message']");
      var name = inputValue[0].value;
      var email = inputValue[1].value;
      var position = inputValue[2].value;
      var username = inputValue[3].value;
      var password = inputValue[4].value;
      var passwordRe = inputValue[5].value;

      switch($(this).text()){
        case "Sửa" :{
          inputValue.removeAttr("disabled");
          nodisplays.removeClass("nodisplay");
          //do not update username
          $(inputValue[3]).attr("disabled","disabled");

          inputValue[0].focus();
          $(this).text("Lưu");
          break;
        }
        case "Lưu":{
          //validate
          for(var i = 0; i < inputValue.length - 2; i++){
            console.log(inputValue[i].value);
            if(inputValue[i].value === ""){
                message.css("color","red");
                message.text("Điền đầy đủ thông tin!");
                return
            }
          }
          if(passwordRe !== password){
            message.css("color","red");
            message.text("Mật khẩu không trùng nhau!");
            return
          }
          inputValue.attr("disabled","disabled");
          $(this).attr("disabled","disabled");
          $(this).text("Đang lưu...");
          message.addClass("nodisplay");
          //Put to server
          $.ajax({
              url: '/admin/managers/' + id,
              type: 'PUT',
              success: function(data, textStatus, jqXHR){
                    if (data.redirect){
                        window.location = data.redirect;
                      }
              },
              contentType: 'application/json',
              data: JSON.stringify({id: id, name: name, username: username, email: email, password: password, passwordRe: passwordRe, position: position})
            });
          break;
        }
      }
    });
    //end update manager-field
})
