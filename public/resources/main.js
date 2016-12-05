$(document).ready(function(){

    //enable the return time input and dropdown
    $("#round").change(function() {

        if(this.checked) {

            $("#rD").removeClass('ui disabled input').addClass('ui input');
            $("#rY").removeClass('ui disabled input').addClass('ui input');
            $("#retMonth").removeClass('ui disabled dropdown').addClass('ui dropdown');

        } else {

            $("#rD").removeClass('ui input').addClass('ui disabled input');
            $("#rY").removeClass('ui input').addClass('ui disabled input');
            $("#retMonth").removeClass('ui dropdown').addClass('ui disabled dropdown');

        }

    });


    //send the user data to server
    $("#sub").click(function() {



        console.log("clicked submit");

        var rq = {};
        rq.origin = $("#origin").val();
        rq.destination = $("#des").val();
        rq.dpdate = $("#dpYear").val()+'-'+$("#dpMonth").val()+'-'+$("#dpDay").val();
        rq.waiting = parseInt(parseFloat($("#waiting").val())*60);
        rq.num = parseInt($('#num').val());
        rq.email = $("#email").val();
        rq.round = 0;
        if ($("#round").checked) {
            rq.round = 1;
            rq.retdate = $("#retYear").val()+'-'+$("#retMonth").val()+'-'+$("#retDay").val();
        }

    	$.ajax({
			type: "POST",
			url: "http://localhost:4000/user",
			dataType: 'json',
            contentType: 'application/json',
			data: JSON.stringify(rq),
			success: function(data) {
				alert("Data goes into our system!");
			},
			error: function(error) {
				console.log(error);
				alert("Unable to send!");
			}
		});
    });
});
