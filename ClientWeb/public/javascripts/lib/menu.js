
$(document).ready(function(){

	/*$("#test").click(function(){
		$("#menu_emoji").slideDown();
	});*/



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