var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var easyjson = require('easyjson');
var http = require('http').Server(app);
var fs = require('fs');
var request = require('request');
var mailer = require('nodemailer');

app.use(express.static('public'));
app.use(bodyParser());

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/user', function(req, res) {
    res.send(req.body);
    pushUser(req.body);
});

function pushUser(data) {
    console.log(data.origin);
    fs.readFile('data/user.json', 'utf8', function readFileCallback(err, file){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(file);
        var p =
        {
            "email" : data.email,
            "FlightRequest": {
                "request": {
                    "slice":[
                        {
                            "origin":data.origin,
                            "destination":data.destination,
                            "date":data.dpdate,
                            "maxConnectionDuration":data.waiting
                        }
                    ],
                    "passengers": {
                        "adultCount":data.num
                    },
                    "solutions":1
                }
            }
        };
        obj.users.push(p); //add some new user
        json = JSON.stringify(obj); //convert it back to json
        fs.writeFile('data/user.json', json, 'utf8', function(err) {
            console.log("ok");
        }); // write it back
    }});
}


function reqAPIdata(data) {
    var mes = {
        method: 'post',
        body: data,
        json: true,
        url: 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=apikey',
        headers: {
            'content-type' : 'application/json'
        }
    };
    request(mes, function(err, res, body){
        if (err) {
            console.log('Error: ',err);
            return;
        }
        console.log('body: ', body);
        //return the api returned data for sending email
        return body;
    })
}

function formatData(data) {
    output = "";
    data['trips']['tripOption'].forEach(function(i) {
        output = output + "Lowest price is :"+i['saleTotal']+"\n";
        i['slice'].forEach(function(j){
            j['segment'].forEach(function(k){
                output = output + k['flight']['carrier']+" "+k['flight']['number']+" "+k['leg'][0]['origin']+" "+k['leg'][0]['departureTime']+" "+k['leg'][0]['destination']+" "+ k['leg'][0]['arrivalTime']+"\n";
            });
        });
    });
    return output;
}

function sendEmail(add, mes) {
    var smtpTransport = mailer.createTransport('SMTP', {
        service: 'Gmail',
        auth: {
            user: "flightonight2016@gmail.com",
            pass: "FlighT@rpi2016"
        }
    });
    var mail = {
        from: 'FlighTonight<flightonight2016@gmail.com>',
        to: add,
        subject: 'Lowest price for your trip from FlighTonight',
        text: mes
    }
    smtpTransport.sendMail(mail, function(err, res) {
        console.log(mail);
        if (err) {
            console.log(err);
        } else {
            console.log("message send: " + res.message);
        }
        // smtpTransport.close();
    });
}

// reqAPIdata({"request":{"slice":[{"origin":"ALB","destination":"PVG","date":"2017-2-2","maxConnectionDuration":120}],"passengers":{"adultCount":1},"solutions":1}})

sendEmail('yanx611@gmail.com', 'hello');

app.listen(4000, function(){
  console.log('Server up on *:4000');
});
