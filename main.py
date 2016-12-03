import json
import requests
import sys
import smtplib
import time
import plotly.plotly as py
import plotly.graph_objs as go
import numpy as np
py.sign_in('yanx611','esDYkmDi0lKxm7gaDn3M')

def userrequest():
    origin = raw_input("Please enter the airport code for your origin airport: ")
    destination = raw_input("Please enter the airport code for your destination airport: ")
    depdat = raw_input("Please enter your depart date in the format of YYYY-MM-DD: ")
    retdat = raw_input("Please enter your return date in the format of YYYY-MM-DD (if not applicapble enter 0): ")
    numofAdult = raw_input("Please enter num of tickets: ")
    numofSol = raw_input("Please enter the options you want: ")
    flightinfo = 0
    if (retdat == '0'):
        flightinfo = {
            "request": {
                "slice": [
                {
                    "origin": origin,
                    "destination": destination,
                    "date": depdat
                }
                ],
                "passengers": {
                    "adultCount": int(numofAdult),
                    "infantInLapCount": 0,
                    "infantInSeatCount": 0,
                    "childCount": 0,
                    "seniorCount": 0
                },
                "solutions": int(numofSol),
                "refundable": 'false'
            }
        }
    else:
        flightinfo = {
            "request": {
                "slice": [
                {
                    "origin": origin,
                    "destination": destination,
                    "date": depdat
                },
                {
                    "origin": destination,
                    "destination": origin,
                    "date": retdat
                }
                ],
                "passengers": {
                    "adultCount": 1,
                    "infantInLapCount": 0,
                    "infantInSeatCount": 0,
                    "childCount": 0,
                    "seniorCount": 0
                },
                "solutions": int(numofSol),
                "refundable": 'false'
            }
        }
    return flightinfo


def ans(info):
    url = 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyAqMuHsyAfVQpVUt8PyWz218nioV0qRWDw'
    headers = {'Content-Type':'application/json'}
    response = requests.post(url,data = json.dumps(info),headers = headers)
    response = response.json()
    return response

def formatdata(data):
    # count variable help to format data
    count = 1
    output = ""
    for i in data['trips']["tripOption"]:
        # each tripOption represent a option to travel
        output = output + "Solution# "+str(count)+" Sales Price per ticket:"+i['saleTotal']+"\n"
        count = count + 1
        for j in i['slice']:
            # segment includes the each part's flight information with details
            for k in j['segment']:
                output = output + k['flight']['carrier']+" "+k['flight']['number']+" "+k['leg'][0]['origin']+" "+k['leg'][0]['departureTime']+" "+k['leg'][0]['destination']+" "+ k['leg'][0]['arrivalTime']+"\n"
        output = output + "\n"
    return output


def sendmail(data):
    #funtion that execute sending one email
    from_add = "yanx611@gmail.com"
    to_add = "yanx3@rpi.edu"
    try:
        s = smtplib.SMTP('smtp.gmail.com',587)
        s.ehlo()
        s.starttls()
        s.login('yanx611@gmail.com','1TsudaKenoHanaYo_2Yue874')
        s.sendmail(from_add,to_add,data)
        s.quit()
    except smtplib.SMTPException:
        print "ERROR:",sys.exc_info()[0]
    return

def job(data):
    answer = ans(data)
    content = formatdata(answer)
    sendmail(content)

def plot():
    # Create random data with numpy
    dat = ['2016-11-29', '2016-11-30', '2016-12-01', '2016-12-02', '2016-12-03', '2016-12-04']
    p = [1823.26, 1928.26, 2280.76, 1823.5, 1923.26, 1950.26]

    # Create a trace
    trace0 = go.Scatter(
        x = dat,
        y = p,
        name = 'Ticket price for 2016-12-20 from ALB - PVG',
        line = dict(
            color = ('rgb(205, 12, 24)'),
            width = 4)
    )
    data = [trace0]

    # Plot and embed in ipython notebook!
    py.plot(data)

    # or plot with: plot_url = py.plot(data, filename='basic-line')


if __name__ == "__main__":
    # info = userrequest();
    # for i in range(2):
    #     job(info);
    #     time.sleep(60)
    plot();
