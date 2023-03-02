from linebot import (
    LineBotApi, WebhookHandler
)

# LineBotApi('line message Token')
line_bot_api = LineBotApi('Dbrwfw6gIBFeCQ0A9pNAtERQZQ7oPMSY+Tuc0A1avvA96WDxyITJSL243Cp5KT/XmUFMFyQdgmFxtBgfOPnusi6+OC0TrB7j9+ncWlUShjT+pEqeB6S0Wx2cYlPXsKrHP/jGsaRtUSysZWcXbibmagdB04t89/1O/w1cDnyilFU=')

rich_menu_list = line_bot_api.get_rich_menu_list()

for rich_menu in rich_menu_list:
    print(rich_menu.rich_menu_id)