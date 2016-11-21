

$(document).ready(function(){
  //start traverse
  var Data = function(province, map, districs){
    this.province = province;
    this.map = map;
    this.districs = districs;
  }
  var province = $("h3").html().substring("Danh sách nhà phân phối tại ".length);
  var map = $("div.col-md-offset-1").find("iframe").attr("src");
  var districs = [];
  var District = function(name){
    this.district_name = name;
    this.retailers = []
  };
  var Retailer = function(nameAndAddress){
    this.nameAndAddress = nameAndAddress,
    this.contacts = []
  };
  var Contact = function(type, ref){
    this.type = type;
    this.ref = ref;
  }
  // console.log(li.find("h5"));

  var h5 = $("ul[style] > li > h5");
  for(var i = 0; i < h5.length; i++){
    districs.push(new District(h5[""+i].innerHTML.trim()));
  }
  var content = $("ul[style] > li > ul > li > p:first-child");
  for (var i = 0; i < content.length; i++){
    // console.log(content[""+i].innerHTML.trim());
  }
  districs.forEach(function(item){

  });
  var li = $("ul[style] > li");
  for(var i = 0; i < districs.length; i++){
    var retailers_in_districs = li[""+ i].children[1].children;
    for(var x = 0; x < retailers_in_districs.length; x++){
      for(var y = 0; y < retailers_in_districs[x].children.length; y++){
        if(y == 0){
          districs[i].retailers.push(new Retailer(retailers_in_districs[x].children[0].innerHTML.trim()));
        }else{
          if(retailers_in_districs[x].children[y].innerHTML.trim()){
            var type = retailers_in_districs[x].children[y].innerHTML.trim().indexOf("mobile") == -1 ? "telephone number" : "mobile phone number";
            var ref = retailers_in_districs[x].children[y].innerHTML.trim().substring(retailers_in_districs[x].children[y].innerHTML.trim().indexOf("</span>") + "</span>".length).trim();
            var contact = new Contact(type,ref);
            districs[i].retailers[x].contacts.push(contact);
          };
        }
        console.log("end");
      };
    }
  }
  var data = new Data(province, map, districs);
  console.log(JSON.stringify(data));




  //end traverse
  //set left-right center of the carousel-control

  //end set left-right center of the carousel-control
  $(".navbar-toggle").click(function(){
    $(".carousel-control").toggle();
  });


  // class="menu-item-hover"
  $(".menu-item-hover").hover(function(){
    $(this).addClass("hovered-menu");
  },function(){
    $(this).removeClass("hovered-menu");
  });

  function sticky_relocate() {
    var window_top = $(window).scrollTop();
    var div_top = $('#sticky-anchor').offset().top;
    if (window_top > div_top) {
        $('#sticky').addClass('stick');
        $('#sticky-anchor').height($('#sticky').outerHeight());
    } else {
        $('#sticky').removeClass('stick');
        $('#sticky-anchor').height(0);
    }
}

$(function() {
    $(window).scroll(sticky_relocate);
    sticky_relocate();
});


//start form validation
var validateNotEmpty = function(element){
    if(element.val().length === 0){
      element.parent().addClass("has-error has-feedback");
      element.siblings(".glyphicon-remove").removeClass("nodisplay");
      element.siblings(".empty").removeClass("nodisplay");
      return false;
    }else{
      return true;
    }
  }
var validatePhoneNotValid = function(){
    var possibleElement = "0123456789()+.- ";
    var value = $('#phone').val();
    if(value.split("").every(function(e){
      return possibleElement.indexOf(e) !== -1;
    }) && value.match(/\d/g).length >= 10 && value.match(/\d/g).length <= 15){
      return true;
    }else{
      $("#helpBlockPhoneInvalid").removeClass("nodisplay");
      $('#phone').siblings(".glyphicon-remove").removeClass("nodisplay");
      $('#phone').parent().addClass("has-error has-feedback");
      return false;
    }
  }


//end form validation
  $('#submit_button').click(function(){
    goog_report_conversion(undefined);
    var nameNotEmpty = validateNotEmpty($("#name"));
    var phoneNotEmpty = validateNotEmpty($("#phone"));
    var messageNotEmpty = validateNotEmpty($("#message"));
    if(phoneNotEmpty){
      var phoneValid = validatePhoneNotValid();
        // alert("" + nameNotEmpty + " " + messageNotEmpty +" " + phoneValid);

      if(nameNotEmpty && phoneValid && messageNotEmpty){
        $.ajax({
            url: '/messagePost',
            type: 'POST',
            success: function(data){
              if(data == "OK"){
                  $('#submit_button').text("Gửi");
                  $('#submit_button').removeClass("disabled");
                  $("#name").val("");
                  $("#phone").val("");
                  $("#message").val("");
                  $("#status").html("Tin nhắn đã được gửi thành công");
              }else{

              }
            },
            contentType: 'application/json',
            data: JSON.stringify({name: $("#name").val(), phone: $("#phone").val(), message: $("#message").val()})
          });
        $('#submit_button').text("...Đang gửi");
        $('#submit_button').addClass("disabled");
        $("#status").html("Xin vui lòng chờ trong giây lát");
      }
    }
  });
  //remove if focus
  function removeIfFocus(e){
    function removeNoDisplay(sib){
      if(!sib.hasClass("nodisplay")){
          sib.addClass("nodisplay");
      }
    }
    $("#status").html("");
    removeNoDisplay(e.siblings(".glyphicon-remove"));
    removeNoDisplay(e.siblings(".empty"));
    removeNoDisplay(e.siblings(".wrong"));
    if(e.parent().hasClass("has-error has-feedback")){
      e.parent().removeClass("has-error has-feedback");
    }
  }
  $("#name").focus(function(){
    removeIfFocus($("#name"));
  });
  $("#phone").focus(function(){
    removeIfFocus($("#phone"));
  });
  $("#message").focus(function(){
    removeIfFocus($("#message"));
  });

//start modal code
// Get the modal
var modal = document.getElementById('myModal');

// Get the image and insert it inside the modal - use its "alt" text as a caption
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");
$(".album img").click(function(){
    modal.style.display = "block";
    modalImg.src = this.src;
    captionText.innerHTML = this.title;
});

// Get the <span> element that closes the modal
document.getElementsByClassName("close")[0].onclick = function() {
  modal.style.display = "none";
};

// When the user clicks on <span> (x), close the modal


//end modal code`

});
