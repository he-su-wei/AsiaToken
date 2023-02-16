# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os
from flask import Flask, request, render_template, abort
from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import *

import configparser
from images import imgur

import json
import time
import qrcode

import connection

app = Flask(__name__)

# LINE 聊天機器人的基本資料
# config = configparser.ConfigParser()
# config.read('config.ini')

# line_bot_api = LineBotApi(config.get('line-bot', 'channel_access_token'))
# handler = WebhookHandler(config.get('line-bot', 'channel_secret'))
line_bot_api = LineBotApi('Dbrwfw6gIBFeCQ0A9pNAtERQZQ7oPMSY+Tuc0A1avvA96WDxyITJSL243Cp5KT/XmUFMFyQdgmFxtBgfOPnusi6+OC0TrB7j9+ncWlUShjT+pEqeB6S0Wx2cYlPXsKrHP/jGsaRtUSysZWcXbibmagdB04t89/1O/w1cDnyilFU=')
handler = WebhookHandler('a4645924f04da41570fb97726699ab91')

# 接收 LINE 的資訊
@app.route("/callback", methods=['POST'])
def callback():
    signature = request.headers['X-Line-Signature']

    body = request.get_data(as_text=True)
    app.logger.info("Request body: " + body)
    
    try:
        print(body, signature)
        handler.handle(body, signature)
    except InvalidSignatureError:
        abort(400)

    return 'OK'

# 學你說話
@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    msg = event.message.text
    msg = msg.encode('utf-8')
    # if isinstance(event, MessageEvent):
    #     line_bot_api.reply_message(event.reply_token, TextSendMessage(text=event.message.text))
    if event.message.text == '我的資產':
        assets = buttons_message(event)
        line_bot_api.reply_message(event.reply_token, FlexSendMessage(alt_text='我的資產', contents = assets ))
    elif event.message.text == '交易紀錄':
        transaction = Carousel_Template(event)
        line_bot_api.reply_message(event.reply_token, FlexSendMessage(alt_text='交易紀錄', contents = transaction))
    elif event.message.text == '我要開戶':
        # 
        # line_bot_api.push_message(event.source.user_id,  TextSendMessage(text='請稍後，正在開戶中'))
        createwallet = createWallet(event)
        line_bot_api.reply_message(event.reply_token,  TextSendMessage(alt_text='我要開戶', text = createwallet))
    elif event.message.text == '錢包帳戶':
        walletAddress = getWalletInfo(event)
        line_bot_api.reply_message(event.reply_token,  FlexSendMessage(alt_text='錢包帳戶',contents = walletAddress))
    elif event.message.text == '詳細資料':
        detailsInfo = details(event)
        line_bot_api.reply_message(event.reply_token,  FlexSendMessage(alt_text='錢包帳戶',contents = detailsInfo))
    
    else:
        line_bot_api.reply_message(event.reply_token, TextSendMessage(text=event.message.text))

def buttons_message(event):
    getUid = event.source.user_id
    print(getUid)
    # U090f1a921bb409eac239b6ae688f9a08

    # f = open('Json/assets.json', encoding='utf-8')
    filename = os.path.join(app.static_folder, 'Json/assets.json')
    with open (filename, encoding='utf-8') as assets_file:
        data = json.load(assets_file)

    Balance = connection.accountBalance(getUid)
    print(Balance)
    data['body']['contents'][1]['contents'][0]['contents'][1]['text'] = Balance
    message = data
    return message

# 交易紀錄
def Carousel_Template(event):
    getUid = event.source.user_id
    print(getUid)
    
    # f = open('Json/transaction.json', encoding='utf-8')
    # data = json.load(f)
    filename = os.path.join(app.static_folder, 'Json/transaction.json')
    with open (filename, encoding='utf-8') as transaction_file:
        data = json.load(transaction_file)
    
    transactionInfo = connection.getAccountData(getUid)
    print("==============================")
    print(transactionInfo)
    # print(len(data))
    print(len(transactionInfo))
    for i in range(5):
        print(i)
        dictNum = len(transactionInfo) - len(data)
        # data['contents']['body']['contents']['text'] = transactionInfo['from'] # from
        data['contents'][i]['body']['contents'][2]['contents'][1]['text'] = transactionInfo[len(transactionInfo)- 1 - i]['to']  # to : 'userAddress
        data['contents'][i]['body']['contents'][3]['contents'][1]['text'] = transactionInfo[len(transactionInfo)- 1 - i]['value'] # value : "count"
        # 時間轉換
        time_stamp = transactionInfo[len(transactionInfo)- 1 - i]['time'] # 設定timeStamp
        struct_time = time.localtime(int(time_stamp)) # 轉成時間元組
        timeString = time.strftime("%Y-%m-%d %H:%M:%S", struct_time) # 轉成字串

        data['contents'][i]['body']['contents'][4]['contents'][1]['text']= timeString  # time
    message = data
    return message

# 開戶
def createWallet(event):
    getUid = event.source.user_id
    print(getUid)

    userAdr = connection.signup(getUid) # call js API signup function

    get_img = qrcode.make(userAdr) # make this user QR code
    get_imgUrl = imgur.uploadImg(get_img, getUid) # call imgur.py get imgur's URL
    # get_imgUrl = 'https://i.imgur.com/GO95Y6J.png'
    message = connection.setImage(getUid, get_imgUrl) #call js API setImage function
    linkResult = line_bot_api.link_rich_menu_to_user(getUid, 'richmenu-002d04a75b219f9d4654552a2eeb6418')
    # get_img.show()
    return message # suess
# richmenu-f904f4354229ab624112dfa36da2f195 //開戶 
# richmenu-002d04a75b219f9d4654552a2eeb6418 //資產、錢包
# line_bot_api.link_rich_menu_to_user('U090f1a921bb409eac239b6ae688f9a08', 'richmenu-f904f4354229ab624112dfa36da2f195')

# 取得帳戶
def getWalletInfo(event):
    getUid = event.source.user_id
    print(getUid)

    get_LevelDb_imgUrl = connection.getval(getUid)
    # f = open('Json/signup.json', encoding='utf-8')
    # data = json.load(f)
    filename = os.path.join(app.static_folder, 'Json/signup.json')
    with open (filename, encoding='utf-8') as signup_file:
        data = json.load(signup_file)

    print(data)
    data['hero']['url'] = get_LevelDb_imgUrl[1] # url
    data['body']['contents'][0]['text'] = get_LevelDb_imgUrl[0]  # 
    data['footer']['contents'][0]['action']['text'] = get_LevelDb_imgUrl[0]
    message = data
    return message

# 詳細資料
def details(event):
    getUid = event.source.user_id
    # getName = line_bot_api.get_profile(userId)
    print(getUid)

    # f = open('Json/details.json', encoding='utf-8')
    # data = json.load(f)

    filename = os.path.join(app.static_folder, 'Json/details.json')
    with open (filename, encoding='utf-8') as details_file:
        data = json.load(details_file)

    Balance = connection.accountBalance(getUid)
    print(Balance)
    data['body']['contents'][2]['contents'][1]['text']= Balance

    message = data
    return message

userTransfer = {'userID': '', 'getAUT_value': 0, 'address': ''}
#  web render html
@app.route("/liff", methods=['GET'])
def liff():
    # global getAUT_value
    if request.method == 'GET':
            print(request.values)
            body = request.values
            if body.get('AUT-value') != None:
                
                count = body.get('AUT-value')
                # getAUT_value = count
                userTransfer['getAUT_value'] = count
                print('python :' + count)
            else:
                print('err')
    return render_template('liff.html')

@app.route("/scan", methods=['GET'])
def scan():
    if request.method == 'GET':
        body = request.values
        if body.get('toAddress') != None:
            address = body.get('toAddress')
            userId = body.get('userId')
            userTransfer['address'] = address
            userTransfer['userID'] = userId
            # accountBalance = connection.accountBalance(userId)
            # if accountBalance <= getAUT_value:
            
            print('python : ' + userTransfer['address'])
            print('python : ' + userTransfer['userID'])

            # _sendDataToAPI()
            # connection.userTransfer(userTransfer['userID'], userTransfer['getAUT_value'], userTransfer ['address'])
        else:
            print('address no data')
    return render_template('scan.html')

@app.route("/transaction", methods=['GET'])
def _sendDataToAPI():
    # print(userTransfer)
    try:
        print(userTransfer['userID'], userTransfer['getAUT_value'],  userTransfer ['address'])
        connection.userTransfer(userTransfer['userID'], userTransfer['getAUT_value'],  userTransfer ['address'])
    except:
        print("交易失敗")
    return render_template('transaction.html')


if __name__ == "__main__":
    app.run()