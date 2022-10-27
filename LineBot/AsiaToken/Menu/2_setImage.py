from linebot import (LineBotApi, WebhookHandler)
# import os
# for e in os.scandir('.'):
#     print(e)
#  LineBotApi( message token )

line_bot_api = LineBotApi('Dbrwfw6gIBFeCQ0A9pNAtERQZQ7oPMSY+Tuc0A1avvA96WDxyITJSL243Cp5KT/XmUFMFyQdgmFxtBgfOPnusi6+OC0TrB7j9+ncWlUShjT+pEqeB6S0Wx2cYlPXsKrHP/jGsaRtUSysZWcXbibmagdB04t89/1O/w1cDnyilFU=')
with open("AsiaToken/Menu/info.png", 'rb') as f:
    print(f)

    line_bot_api.set_rich_menu_image("richmenu-002d04a75b219f9d4654552a2eeb6418", "image/jpeg", f)