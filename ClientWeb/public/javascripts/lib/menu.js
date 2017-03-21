
$(document).ready(function(){

	/*$("#test").click(function(){
		$("#menu_emoji").slideDown();
	});*/


    $('.bouton_emoji').click(function(){

        $("#menu_emoji").slideToggle(50);

        $("#inputSendMessage").focus();

    });

    $('.emoticon').click(function(){
		
		var textarea_val = jQuery.trim($('#inputSendMessage').val());
		var emoticon_val = $(this).attr('value');

		if (textarea_val == '') {
			var sp = '';
		} else {
			var sp = ' ';
		}

		/*if(emoticon_val == ':)'){
			$("<span></span>").html('<img src="img/smile.png" alt="">').appendTo('.messInBox');
		}*/

		$('#inputSendMessage').focus().val(jQuery.trim(textarea_val + sp + emoticon_val + sp));
		//$('#div1').focus().val(jQuery.trim(div_val + ' ' + emoticon_val + ' '));
	});


	$("#fleche").click(function(){

		//var x=window.innerWidth;

		//if (x <= 550) {

			//document.getElementById("channels").style.display = "none";
			//document.getElementById("users").style.display = "none";

			$("#channels").slideToggle(50);
			$("#users").slideToggle(50);

	        $("#inputSendMessage").focus();

    	//}

	});

	/*if (window.innerWidth > 550){
		document.getElementById("channels").style.display = "block";
		document.getElementById("users").style.display = "block";
	}*/

	
});