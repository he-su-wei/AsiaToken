from unittest import result
import urllib.request, urllib.parse


def signup(uid):

    url = 'http://120.108.111.229:8080/signup'
    values = {'userID': uid}

    data = urllib.parse.urlencode(values)
    data = data.encode('ascii') # data should be bytes
    req = urllib.request.Request(url, data)
    with urllib.request.urlopen(req) as response:
        the_page = response.read()
        user_address = the_page.decode('utf-8')
        print(user_address)
    return user_address

def setImage(userId, imgUrl): 

    url = 'http://120.108.111.229:8080/setImage'
    values = {'userID': userId, 'url': imgUrl}

    data = urllib.parse.urlencode(values)
    data = data.encode('ascii')
    req = urllib.request.Request(url, data)
    with urllib.request.urlopen(req) as response:
        the_page = response.read()
        result = the_page.decode('utf-8')
        print(result) #success
    return result


def getData(userId): #address&url
    url = 'http://120.108.111.229:8080/getVal'
    values = {'userID': userId}

    data = urllib.parse.urlencode(values)
    data = data.encode('ascii') # data should be bytes
    req = urllib.request.Request(url, data)
    with urllib.request.urlopen(req) as response:
        the_page = response.read().decode('utf-8')
        result = the_page.split(",")
        print(result[0])
        print(result[1])
    return result
    #getVal