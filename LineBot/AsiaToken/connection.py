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

# 取得帳戶地址及圖片位置
def getval(userId): #address&url
    url = 'http://120.108.111.229:8080/getVal'
    values = {'userID': userId}

    data = urllib.parse.urlencode(values)
    data = data.encode('ascii') # data should be bytes
    req = urllib.request.Request(url, data)
    with urllib.request.urlopen(req) as response:
        the_page = response.read().decode('utf-8')
        result = the_page.split(",")
        print(result[0]) # address 
        print(result[1]) # url
    return result
    #getVal

# 取得帳戶餘額
def accountBalance(userId): #address&url
    url = 'http://120.108.111.229:8080/accountBalance'
    values = {'userID': userId}

    data = urllib.parse.urlencode(values)
    data = data.encode('ascii')
    req = urllib.request.Request(url, data)
    with urllib.request.urlopen(req) as response:
        the_page = response.read()
        result = the_page.decode('utf-8')
        print(result) # int
    return result

# 取得交易紀錄
def getAccountData(userId): #address&url
    url = 'http://120.108.111.229:8080/accountBalance'
    values = {'userID': userId}

    data = urllib.parse.urlencode(values)
    data = data.encode('ascii')
    req = urllib.request.Request(url, data)
    with urllib.request.urlopen(req) as response:
        the_page = response.read()
        result = the_page.decode('utf-8')
        print(result[0]) # from:'user'
        print(result[1]) # to : 'userAddress'
        print(result[2]) # value : "count" 交易數量
        print(result[3]) # time : 'timestamp'
    return result

# 交易
def transferAUT(userId,value): #address&url
    url = 'http://120.108.111.229:8080/transferAUT'
    values = {'userID': userId}

    data = urllib.parse.urlencode(values)
    data = data.encode('ascii')
    req = urllib.request.Request(url, data)
    with urllib.request.urlopen(req) as response:
        the_page = response.read()
        result = the_page.decode('utf-8')
        print(result) # true
    return result
