var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var fs = require('fs');
var request = require('request');
var CronJob = require('cron').CronJob;
var mailer   = require("emailjs");

app.use(express.static('public'));
app.use(bodyParser());

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/user', function(req, res) {
    //send back server response
    res.send(req.body);
    pushUser(req.body);
});


function pushUser(data) {
    fs.readFile('data/user.json', 'utf8', function readFileCallback(err, file){
        if (err){
            console.log(err);
        } else {
            //open file convert it to object
            obj = JSON.parse(file);
            var p;
            //requests varies depend on whether roundtrip
            if (data.round == 0) {
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
            } else {
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
                                },
                                {
                                    "origin":data.destination,
                                    "destination":data.origin,
                                    "date":data.retdate,
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
            }
            //add some new user
            obj.users.push(p);
            //convert it back to json
            json = JSON.stringify(obj);
            // write it back
            fs.writeFile('data/user.json', json, 'utf8', function(err) {
                console.log("user data has stored.");
            });
        }
    });
}


function reqAPIdata(data,email) {
    var EventEmitter = require('events').EventEmitter;
    var resp = new EventEmitter();
    var mes = {
        method: 'post',
        body: data,
        json: true,
        url: 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=somekey',
        headers: {
            'content-type' : 'application/json'
        }
    };
    request(mes, function(err, res, body){
        if (err) {
            console.log('Error: ',err);
            return;
        }
        //return the api returned data for sending email
        resp.data = body;
        resp.mes = formatData(resp.data);
        resp.mail = email;
        resp.emit('update');
    });

    resp.on('update', function () {
        console.log(resp.mail);
        console.log(resp.mes);
        sendEmail(resp.mail,resp.mes);
    });
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
    //function to send wmail that using our Google account, might need a secure way to do this hhh
    console.log("start sending mail to: "+add);
    var server = mailer.server.connect({
        user:"flightonight2016@gmail.com",
        password:"FlighT@rpi2016",
        host:"smtp.gmail.com",
        ssl: true
    });
    server.send({
        text: mes,
        from: "FlighTonight<flightonight2016@gmail.com>",
        to: add,
        subject: "Today's lowest price for your trip from FlighTonight"
    }, function(err, message) {
        console.log(err||message);
    });



    console.log("has been sent!");
}

function executewhole() {
    //read file and pass to api
    var list = JSON.parse(fs.readFileSync('data/user.json', 'utf8'));
    list['users'].forEach(function(i) {
        var d = i['FlightRequest'];
        var e = i['email'];
        var apireturn = reqAPIdata(d,e);
    });
}

function schedule(){
    var job = new CronJob({
        // this job should run everyday at 11:00am
        cronTime: '30 * * * * *',
        onTick: function() {
            executewhole();
        },
        start: false,
        timeZone: 'America/New_York'
    });
    job.start();
}

schedule();
// executewhole();
app.listen(4000, function(){
  console.log('Server up on *:4000');
});
