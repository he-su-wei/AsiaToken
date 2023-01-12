
# Create your views here.
from time import sleep
from django.conf import settings
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseForbidden
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from django.views import View

# line bot api
from linebot import LineBotApi, WebhookParser
from linebot.exceptions import InvalidSignatureError, LineBotApiError
from linebot.models import *
from liffpy import (
    LineFrontendFramework as LIFF,
    ErrorResponse
)


line_bot_api = LineBotApi('<channel access token>')

import json
import time
#  qrcode
import qrcode
from PIL import Image

from AsiaToken import connection
from AsiaToken.images import imgur

line_bot_api = LineBotApi(settings.LINE_CHANNEL_ACCESS_TOKEN)
parser = WebhookParser(settings.LINE_CHANNEL_SECRET)
liff_api = LIFF(settings.LINE_CHANNEL_ACCESS_TOKEN)

@csrf_exempt

# class lineMethod:


def callback(request):
    # global USERID
    if request.method == 'POST':
        signature = request.META['HTTP_X_LINE_SIGNATURE']
        body = request.body.decode('utf-8')
        try:
            events = parser.parse(body, signature)
        except InvalidSignatureError:
            print('HttpResponseForbidden')
            return HttpResponseForbidden()
            
        except LineBotApiError:
            print('HttpResponseForbidden')  
            return HttpResponseBadRequest()
        
        for event in events:
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
            
            # elif event.message.text == '資產移轉':
            #     try:
            #         # USERID = event.source.user_id
            #         line_bot_api.reply_message(event.reply_token, TextSendMessage(text='https://liff.line.me/1657672493-Ed95y1Rq'))
            #     except:
            #         pass
            else:
                line_bot_api.reply_message(event.reply_token, TextSendMessage(text=event.message.text))
        return HttpResponse()
    else:
        return HttpResponseBadRequest()

# 我的資產
def buttons_message(event):
    getUid = event.source.user_id
    print(getUid)
    # U090f1a921bb409eac239b6ae688f9a08

    f = open('AsiaToken/Json/assets.json', encoding='utf-8')
    data = json.load(f)

    Balance = connection.accountBalance(getUid)
    print(Balance)
    data['body']['contents'][1]['contents'][0]['contents'][1]['text'] = Balance
    message = data
    return message

# 交易紀錄
def Carousel_Template(event):
    getUid = event.source.user_id
    print(getUid)
    
    f = open('AsiaToken/Json/transaction.json', encoding='utf-8')
    data = json.load(f)
    
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
    f = open('AsiaToken/Json/signup.json', encoding='utf-8')
    data = json.load(f)
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

    f = open('AsiaToken/Json/details.json', encoding='utf-8')
    data = json.load(f)
    Balance = connection.accountBalance(getUid)
    print(Balance)
    data['body']['contents'][2]['contents'][1]['text']= Balance[0]
    message = data
    return message

userTransfer = {'userID': '', 'getAUT_value': 0, 'address': ''}
#  web render html
def liff(request):
    # global getAUT_value
    if request.method == 'GET':
            body = request.GET
            if body.get('AUT-value') != None:
                
                count = body.get('AUT-value')
                # getAUT_value = count
                userTransfer['getAUT_value'] = count
                print('python :' + count)
            else:
                print('err')
    return render(request, 'liff.html')

def scan(request):
    if request.method == 'GET':
            body = request.GET
            if body.get('toAddress') != None:
                address = body.get('toAddress')
                userId = body.get('userId')
                userTransfer ['address'] = address
                userTransfer['userID'] = userId
                # accountBalance = connection.accountBalance(userId)
                # if accountBalance <= getAUT_value:
                
                print('python : ' + userTransfer ['address'])
                print('python : ' + userTransfer['userID'])
                _sendDataToAPI()
                # connection.userTransfer(userTransfer['userID'], userTransfer['getAUT_value'], userTransfer ['address'])
            else:
                print('address no data')
    return render(request, 'scan.html')

def _sendDataToAPI(request):
    # print(userTransfer)
    try:
        # time.sleep(5)
        print(userTransfer['userID'], userTransfer['getAUT_value'],  userTransfer ['address'])
        connection.userTransfer(userTransfer['userID'], userTransfer['getAUT_value'],  userTransfer ['address'])
    except:
        print("交易失敗")
    return render(request, 'transaction.html')