$(document).ready(function(){

    //enable the return time input and dropdown
    $("#round").change(function() {

        if(this.checked) {
            console.log("Return data field open!");
            $("#rD").removeClass('ui disabled input').addClass('ui input');
            $("#rY").removeClass('ui disabled input').addClass('ui input');
            $("#retMonth").removeClass('ui disabled dropdown').addClass('ui dropdown');

        } else {
            console.log("Return data field close!");
            $("#rD").removeClass('ui input').addClass('ui disabled input');
            $("#rY").removeClass('ui input').addClass('ui disabled input');
            $("#retMonth").removeClass('ui dropdown').addClass('ui disabled dropdown');

        }

    });

    //check if the input is a valid format
    function validateForm() {
        numdays = [31,28,31,30,31,30,31,31,30,31,30,31];
        namemonth = ["January","Feburary","March","April","May","June","July","August","September","October","November","December"];

        if ($("#dpYear").val() == "" || $("#dpMonth").val() == "" ||  $("#dpDay").val() == "" || $("#origin").val() == "" || $("#des").val() == "" || $('#num').val() == "" || $("#email").val() == "" || $("#waiting").val() == "") {
            console.log("not fill in all the blanks")
            alert("Please fill in all fields");
            return false;
        }
        if ($("#dpYear").val().length != 4 || $("#dpDay").val().length != 2) {
            console.log("invalid departure date or year")
            alert("Please enter valid departure date or year in the format of DD and YYYY.")
            return false;
        }
        if ($("#origin").val().length != 3 || $("#des").val().length != 3 || /^[a-zA-Z]+$/.test($("#origin").val()) == false || /^[a-zA-Z]+$/.test($("#des").val()) == false ) {
            console.log("invalid input for destination or origin");
            alert("Please enter valid airport code.")
            return false;
        }
        if ($("#origin").val() == $("#des").val()) {
            console.log("same origin and destination");
            alert("You cannot enter same value for origin and destination");
            return false;
        }
        console.log("fields valid!")
        var today = new Date();
        if (parseInt($("#dpYear").val()) < today.getFullYear()) {
            alert("You cannot check past ticket's value");
            return false;
        } else {
            if (parseInt($("#dpYear").val()) == today.getFullYear()) {
                if (parseInt($("#dpMonth").val()) < today.getMonth()+1 ) {
                    alert("You cannot check past ticket's value");
                    return false;
                } else {
                    if (parseInt($("#dpMonth").val()) ==  today.getMonth()+1 ) {
                        if (parseInt($("#dpDay").val()) < today.getDate()) {
                            alert("You cannot check past ticket's value");
                            return false;
                        }
                    }
                }
            }
        }
        console.log("departure date valid!")

        if ($("#round").is(':checked')) {
            console.log("roundtrip checked!")
            if ($("#retYear").val() == "" || $("#retMonth").val() == "" || $("#retDay").val() == "" ) {
                alert("please enter return date");
                return false;
            }
            if ($("#retYear").val().length != 4 || $("#retDay").val().length != 2) {
                console.log("invalid return date or year")
                alert("Please enter valid return date or year in the format of DD and YYYY.")
                return false;
            }
            if (parseInt($("#retYear").val()) < parseInt($("#dpYear").val())) {
                alert("Return date cannot be before departure date.");
                return false;
            } else {
                if (parseInt($("#retYear").val()) == parseInt($("#dpYear").val())) {
                    if (parseInt($("#retMonth").val()) < parseInt($("#dpMonth").val()) ) {
                        alert("Return date cannot be before departure date.");
                        return false;
                    } else {
                        if (parseInt($("#retMonth").val()) ==  parseInt($("#dpMonth").val()) ) {
                            if (parseInt($("#retDay").val()) < parseInt($("#dpDay").val())) {
                                alert("Return date cannot be before departure date.");
                                return false;
                            }
                        }
                    }
                }
            }
        }

        console.log("return date valid!")
        if ($("#dpMonth").val() == "2" && parseInt($("#dpYear".val()))%4 == 0 && parseInt($("#dpYear".val()))%100 != 0) {
            if (parseInt($("#dpDay".val())) > 29) {
                alert(namemonth[parseInt($("#dpMonth").val())-1]+" does not have more than 29 days");
                return false;
            }
        } else {

            var m = parseInt($("#dpMonth").val());
            if ( parseInt($("#dpDay").val()) > numdays[m-1]) {
                alert(namemonth[m-1]+" does not have more than "+numdays[m-1]+" days");
                return false;
            }
        }
        return true;
    }



    //send the user data to server
    //not using the form submit function as the it will not reveive the data
    $("#sub").click(function() {

        if (validateForm()) {
            var rq = {};
            rq.origin = $("#origin").val();
            rq.destination = $("#des").val();
            rq.dpdate = $("#dpYear").val()+'-'+$("#dpMonth").val()+'-'+$("#dpDay").val();
            rq.waiting = parseInt(parseFloat($("#waiting").val())*60);
            rq.num = parseInt($('#num').val());
            rq.email = $("#email").val();
            rq.round = 0;
            if ($("#round").is(':checked')) {
                rq.round = 1;
                rq.retdate = $("#retYear").val()+'-'+$("#retMonth").val()+'-'+$("#retDay").val();
            }
            console.log("data post to server formed!");
        	$.ajax({
    			type: "POST",
    			url: "/user",
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
        }
    });
});
