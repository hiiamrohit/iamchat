/*
 * JQuery functions for slideout feedback form
 * 
 * Sets up a sliding form on click of a feedback button
 * On submit button will send the data to a php script
 * 
 * By http://www.paulund.co.uk
 */
(function ($j) {

  feedback_button = {

    onReady: function () {      
      this.feedback_button_click();
      this.send_feedback();
    },
    
    feedback_button_click: function(){
    	$("#feedback_button").click(function(){
    		$('.form').slideToggle();   		
    	});
    },
    
    send_feedback: function(){
    	$('#feedback').click(function(){
    		if($('#feedback_text').val() != ""){
    			$("#myModalLoading").modal('show');
    			$("#loadingText").html("Feedback sending please wait..");
    			$('.status').text("");
    			
    			$.ajax({  
    				type: "POST",  
      			  	url: "/sendEmail",  
      			  	data: 'feedback=' + $('#feedback_text').val(),  
	      			success: function(result,status) { 
	      				$('#feedback_text').val('');
	      				$("#myModalLoading").modal('hide');
    			        $("#loadingText").html("Loading please wait..");
    			        $("#alertMsg").html("<h3> "+result+"</h3>");
                        $("#myModal").modal('show');
                        $('.form').slideToggle();
	      			},
	      			error: function(result,status){
	      				 $("#alertMsg").html("<h3> "+result+"</h3>");
                         $("#myModal").modal('show');
	      			}  
      			});
    		}
    	});
    },
    
    
  };

  $j().ready(function () {
	  feedback_button.onReady();
  });

})(jQuery);	
