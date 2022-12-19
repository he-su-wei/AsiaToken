# import requests
import urllib.request, urllib.parse
import json

url = 'http://120.108.111.229:8080/getAccountData'
values = {'userID': 'U090f1a921bb409eac239b6ae688f9a08'}

data = urllib.parse.urlencode(values)
data = data.encode('ascii') # data should be bytes
req = urllib.request.Request(url, data)
with urllib.request.urlopen(req) as response:
   the_page = response.read()
   print(the_page)
   print(json.loads(the_page.decode('utf-8')))
   # print(json.loads(the_page))