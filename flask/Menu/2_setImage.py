from linebot import (LineBotApi, WebhookHandler)
# import os
# for e in os.scandir('.'):
#     print(e)
#  LineBotApi( message token )

line_bot_api = LineBotApi('8yE3QQnj1l19ZkKo3Xy1u4BwxrAhNptYW1DH/tw2e30qWuOI7fTvMIPcu4cGOSeQfdzo+NqZTNbBaCrXBrJ0EycNNyVJygvaB3Ypgkeqh1prTUdyK9zv4PE2JcbOHBF/NmQtG/nYXUo7dzTrD4npcQdB04t89/1O/w1cDnyilFU=')
with open("flask/Menu/info.png", 'rb') as f:
    print(f)

    line_bot_api.set_rich_menu_image("richmenu-4e08cdd6c12c7cfcc86ba796c976efc8", "image/jpeg", f)