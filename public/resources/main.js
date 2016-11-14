$(document).ready(function(){
	$('.ui.form').form({
	  	fields: {
	    	origin: {
	      		identifier: 'origin',
	      		rules: [{
	        		type: 'empty'
	      		}]
	  		},
			destination: {
				identifier: 'destination',
				rules: [{
					type: 'empty'
				}]
			},
			dpDay: {
				identifier: 'dpDay',
				rules: [{
					type:'empty'
				}]
			},
			dpYear: {
				identifier: 'dpYear',
				rules: [{
					type:'empty'
				}]
			},
			dpMonth: {
				identifier: 'dpMonth',
				rules: [{
					type:'empty'
				}]
			}
	  	}
	});


	$("#info").submit(function(e) {
		// create a request variable from the form
		var FlightRequest = {
			"request": {
				"slice" : [
					{
						"origin": $("#origin").val(),
						"destination": $("#des").val(),
						"date":$("#dpYear").val()+'-'+$("#dpMonth").val()+'-'+$("#dpDay").val()
					}
				],
				"passengers" : {
					"adultCount" : 1,
					"infantInLapCount" : 0,
					"infantInSeatCount" : 0,
					"childCount" : 0,
					"seniorCount" : 0
				},
				"solutions" : 5,
				"refundable" : false
			}
		};


		//use the input value to get request from qpx express api, 50 query max per day.
		$.ajax({
			type: "POST",
			url: "https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyAtcZMAH1JI3lyOdPqBoLI1P7piKmiM_hA",
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(FlightRequest),
			success: function(data) {
				console.log(JSON.stringify(data));
			},
			error: function() {
				alert("Access to Google QPX Express failed");
			}
		});
	});

});
