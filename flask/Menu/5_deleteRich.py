from linebot import (
    LineBotApi, WebhookHandler
)

# LineBotApi('line message Token')
line_bot_api = LineBotApi('Dbrwfw6gIBFeCQ0A9pNAtERQZQ7oPMSY+Tuc0A1avvA96WDxyITJSL243Cp5KT/XmUFMFyQdgmFxtBgfOPnusi6+OC0TrB7j9+ncWlUShjT+pEqeB6S0Wx2cYlPXsKrHP/jGsaRtUSysZWcXbibmagdB04t89/1O/w1cDnyilFU=')

line_bot_api.delete_rich_menu('richmenu-35c9ef2b0dff2a2f5c6ca416c25e3d8a')