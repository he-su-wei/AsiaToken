import requests
# Authorization":"Bearer (Token)
headers = {"Authorization":"Bearer 8yE3QQnj1l19ZkKo3Xy1u4BwxrAhNptYW1DH/tw2e30qWuOI7fTvMIPcu4cGOSeQfdzo+NqZTNbBaCrXBrJ0EycNNyVJygvaB3Ypgkeqh1prTUdyK9zv4PE2JcbOHBF/NmQtG/nYXUo7dzTrD4npcQdB04t89/1O/w1cDnyilFU=","Content-Type":"application/json"}
# richmenu-XXXXXXXXX....
req = requests.request('POST', 'https://api.line.me/v2/bot/user/all/richmenu/richmenu-1eddb758b8a349e49e5e4a41ea88a563', headers=headers)
print(req.text)