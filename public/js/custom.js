    
$(document).ready(function() { 
$("#contextFirst").fadeIn(2000);
var elem = document.getElementById('barch');
  var socket = io.connect();
  var count=0;
  var totalOnlineUser = false; 
  var userActivity = false;
  var nm = $("#username").val();
  //window.location.hostname  
   $('#chatForm').submit(function(){
  $("#msgSending").html("<img src='images/msgloader.GIF' style='float:left'>Message sending please wait...");
  elem.scrollTop = elem.scrollHeight;  
    
    var msg = $('#chatInput').val();
    socket.emit('chatMsg', { name: nm+" ["+window.datetime+"] ", msg: msg} );
    $('#chatInput').val('');
    return false;
  });
  
  socket.on("msgEveryOne",function(data, messages) {
  
      $('#messages').append('<p class="bubble-content"><b style="color:green"><i>'+data.name+":</b></i> "+data.msg+'</p>');
      $("#msgSending").html(" ");
      
     
    });
    
    
      
    $("#startChat").click(function() {
       var name = $.trim($("#nickname").val());
       if(name=='') {
       $("#alertMsg").html("<h3> Please enter your nick name!</h3>");
        $("#myModal").modal('show');
        return false;
       } else if(!name.match("^[a-zA-Z0-9]*$")){
          $("#alertMsg").html("<h3> space and special characters are not allowed!</h3>");
          $("#myModal").modal('show');
      } else {
       socket.emit('chkUser',{name:name});
       
       socket.on('chkUser',function(chk) { 
           if(chk>(-1)) {
           $("#myModalLoading").modal('hide');
          $("#alertMsg").html("<h3> Nickname already taken choose other one!</h3>");
          $("#myModal").modal('show'); 
          } else {
          socket.emit('joined',{name:name});
           $("#contextFirst").slideUp('slow');
           $("#username").val(name);
       
          }  
       });
       $("#myModalLoading").modal('show');
       }
       return false;
    });
    
    socket.on('newOne',function(data, messages) {
        $('#alertmessages').html('<span style ="color:green;font-size:15px; ">'+data.name+" "+data.msg+'</span>');
         $('#messages').empty();
        $.each(messages, function(index, vl) {  
         $('#messages').append('<p class="bubble-content"><b style="color:green"><i>'+vl.name+":</b></i> "+vl.msg+'</p>');
          });
       });
    
   
   socket.on('myInfo',function(me,datetime) {
    $('#myInfo').html(me);
      $('#lgtime').html("["+datetime+"]");
     progressBar('true');
    
   }); 

        socket.on('totalOnlineUser', function(data, me) { 
         $('#totalUser').text((data.length)); 
         $('#onlineUser').empty();  
         $('#userList').empty(); 
         $('#privateChatBox').empty();
             $.each(data,function(index,val) {
             
               $('#userList').append('<li class="list-group-item " id="li_'+val+'"><span class="glyphicon glyphicon-star-empty" ></span> <a href="javascript:void(0);" class="pchat" id="'+val+'">'+val+'</a><span><span id="typing_'+val+'" class="text-danger"  ></span></li>');
              
            
             
        });
        
      }); 
      
      
      
      
        
        // User is Typing...
        var typing = false;
        var timeout = undefined;
        
    function timeoutTyping() {
        typing = false;
        socket.emit('typing', false);           
    }
    
        
        $("#chatInput").keypress(function(e) {
           if(e.which !== 13) {
             if(typing === false && $(this).is(":focus")) {
               typing = true;
               socket.emit('typing',true);
             } else {
             clearTimeout(timeout);
             timeout = setTimeout(timeoutTyping,3000);
             }
           }
        });
        
        socket.on("isTyping",function(data) {
           if(data.isTyping) {
              $("#typing_"+data.user).html(" is typing..");
              timeout = setTimeout(timeoutTyping,3000);
           } else {
              $("#typing_"+data.user).html(" ");
           }
        });
        // End user is typing...
        
        socket.on('usersActivity', function(data) {
         $('#userActivity').empty();
          $.each(data, function(index, value) {
                      $('#userActivity').prepend('<li class=" list-group-item '+value.color+'">'+value.name+value.msg+' </li>');
          });
          
          
            
        });
        
socket.on('userDisconnect',function() {
  alert("You are disconnected due to some server issue, reloading..");
  window.location.replace(window.location.pathname);
}); 
       
        
        ////////// Private chat ///
        
   

var count=0;
socket.on('getprivatemsg', function(sender, key, message) {

var elem = document.getElementById('chat_div_'+sender);
if(typeof(elem) != 'undefined' && elem != null){

}else{
createChatBox(sender);
}

if((sender==key) && (count==0)) {
  alert("You are chatting with yourself, Server will repeat what ever you'll send! By this you can test yourself if no user online except you!");
  count++;
  }
  
//$("#log_"+sender).append(message + "<br/>");
     $("#chat_div_"+sender).chatbox("option", "boxManager").addMsg(sender, message); 
  });
  
  
  



$(document).on('click', '.pchat', function() {  
 var id=$(this).attr('id');
 var elem = document.getElementById('chat_div_'+id);
if(typeof(elem) != 'undefined' && elem != null){
  
 $("#chat_div_"+id).chatbox("option", "boxManager").toggleBox();  
}else{
createChatBox(id);
}
 
});


var offset =0;
function createChatBox(userid) {
//var box[] = userid;
        var privateDiv = document.getElementById('PrivateTab');
        var privateBox = document.createElement('div');
        var privateLog = document.createElement('div');
        $(privateBox).attr({
'id': "chat_div_"+userid,
});
$(privateLog).attr({
'id': "log_"+userid,
'style':"display:none;"
});
privateDiv.appendChild(privateBox);
privateDiv.appendChild(privateLog);     
          $("#chat_div_"+userid).chatbox({id:"Me", 
                                                user:{key : "value"},
                                                title : userid,
                                                offset:offset,
                                                messageSent : function(id, user, msg) {
                                                    //$("#log_"+userid).append(id + " said: " + msg + "<br/>");
                                                    $("#chat_div_"+userid).chatbox("option", "boxManager").addMsg(id, msg); 
     
socket.emit('sendprivatechat', userid, msg);

                                                }});
                                                
   offset = offset+310;                                              // getter    
              }
              
              
           




function private_send(key){
var messagetosend = $('#to_'+key+"_data").val();
  $('#to_'+key+"_text").append("<div><b>Me: </b>" + messagetosend + "</div>");
socket.emit('sendprivatechat', key, messagetosend);
}
        
        
        ///// End Private Chat /////
        
     
     //var i = 0; 
     //setInterval(function(){ i++; console.log("Hello"+i+datetime)},1000);
     setInterval(function() {
        socket.emit('dateTimeUpdate',{datatime:window.datetime}); 
     },1000); 
  });
  
 
function progressBar(totalOnlineUser) {

   if(totalOnlineUser) {  
        $("#context").slideDown('slow',function() {
        $("#myModalLoading").modal('hide');
        });  
   } else {
  
       $(".modal-body").html("<img src='/images/loading.GIF'><h3>  Loading please wait....</h3>");
       
        
   }
}

