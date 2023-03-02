import requests
import json

headers = {"Authorization":"Bearer 8yE3QQnj1l19ZkKo3Xy1u4BwxrAhNptYW1DH/tw2e30qWuOI7fTvMIPcu4cGOSeQfdzo+NqZTNbBaCrXBrJ0EycNNyVJygvaB3Ypgkeqh1prTUdyK9zv4PE2JcbOHBF/NmQtG/nYXUo7dzTrD4npcQdB04t89/1O/w1cDnyilFU=","Content-Type":"application/json"}
body = {
  "size": {
    "width": 2500,
    "height": 843
  },
  "selected": True,
  "name": "資訊",
  "chatBarText": "查看更多資訊",
  "areas": [
    {
      "bounds": {
        "x": 0,
        "y": 0,
        "width": 1221,
        "height": 843
      },
      "action": {
        "type": "message",
        "text": "我的資產"
      }
    },
    {
      "bounds": {
        "x": 1264,
        "y": 0,
        "width": 1236,
        "height": 843
      },
      "action": {
        "type": "message",
        "text": "錢包帳戶"
      }
    }
  ]
}
req = requests.request('POST', 'https://api.line.me/v2/bot/richmenu', 
                       headers=headers,data=json.dumps(body).encode('utf-8'))

print(req.text)