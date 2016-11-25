import json
import requests
import sys
import smtplib

def userrequest():
    origin = raw_input("Please enter the airport code for your origin airport: ")
    destination = raw_input("Please enter the airport code for your destination airport: ")
    depdat = raw_input("Please enter your depart date in the format of YYYY-MM-DD: ")
    retdat = raw_input("Please enter your return date in the format of YYYY-MM-DD (if not applicapble enter 0): ")
    numofAdult = raw_input("Please enter num of tickets: ")
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
                "solutions": 1,
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
                "solutions": 1,
                "refundable": 'false'
            }
        }
    return flightinfo


def ans():
    info = userrequest();
    url = 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=somekey'
    headers = {'Content-Type':'application/json'}
    response = requests.post(url,data = json.dumps(info),headers = headers)
    return response

def sendmail():
    #funtion that execute sending one email
    from_add = "sender@gmail.com"
    to_add = "usermail@sserver.com"
    msg = """ This is the message body"""
    try:
        s = smtplib.SMTP('smtp.gmail.com',587)
        s.ehlo()
        s.starttls()
        s.login('someemail','somepassword')
        s.sendmail(from_add,to_add,msg)
        s.quit()
    except smtplib.SMTPException:
        print "ERROR:",sys.exc_info()[0]
    return



if __name__ == "__main__":
    print ans().text
    sendmail()
