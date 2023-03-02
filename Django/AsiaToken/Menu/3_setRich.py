import requests
# Authorization":"Bearer (Token)
headers = {"Authorization":"Bearer Dbrwfw6gIBFeCQ0A9pNAtERQZQ7oPMSY+Tuc0A1avvA96WDxyITJSL243Cp5KT/XmUFMFyQdgmFxtBgfOPnusi6+OC0TrB7j9+ncWlUShjT+pEqeB6S0Wx2cYlPXsKrHP/jGsaRtUSysZWcXbibmagdB04t89/1O/w1cDnyilFU=","Content-Type":"application/json"}
# richmenu-XXXXXXXXX....
req = requests.request('POST', 'https://api.line.me/v2/bot/user/all/richmenu/richmenu-f904f4354229ab624112dfa36da2f195', headers=headers)
print(req.text)