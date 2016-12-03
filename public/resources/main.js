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
        if ($("#round").checked) {
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


	// $("#sub").click(function(e) {
	// 	//create a request variable from the form
	// 	var FlightRequest = {
	// 		"request": {
	// 			"slice" : [
	// 				{
	// 					"origin": $("#origin").val(),
	// 					"destination": $("#destination").val(),
	// 					"date":$("#dpYear").val()+'-'+$("#dpMonth").val()+'-'+$("#dpDay").val()
	// 				}
	// 			],
	// 			"passengers" : {
	// 				"adultCount" : 1,
	// 				"infantInLapCount" : 0,
	// 				"infantInSeatCount" : 0,
	// 				"childCount" : 0,
	// 				"seniorCount" : 0
	// 			},
	// 			"solutions" : 1
	// 		}
	// 	};
	// 	alert($("#dpYear").val()+'-'+$("#dpMonth").val()+'-'+$("#dpDay").val()+" from  "+$("#origin").val()+" to "+ $("#destination").val())
    //
	// 	//use the input value to get request from qpx express api, 50 query max per day.
	// 	$.ajax({
	// 		type: "POST",
	// 		url: "https://www.googleapis.com/qpxExpress/v1/trips/search?key=somekey",
	// 		dataType: 'json',
	// 		contentType: 'application/json',
	// 		data: JSON.stringify(FlightRequest),
	// 		success: function(data) {
	// 			alert("Access to Google QPX Express success");
	// 			console.log(JSON.stringify(data));
    //
	// 		},
	// 		error: function(error) {
	// 			console.log(error);
	// 			alert("Access to Google QPX Express failed");
	// 		}
	// 	});
	// });
});
