
# Create your views here.
from ast import Pass
from email import message
from time import sleep
from django.conf import settings
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseForbidden
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render


# line bot api
from linebot import LineBotApi, WebhookParser
from linebot.exceptions import InvalidSignatureError, LineBotApiError
from linebot.models import *
from liffpy import (
    LineFrontendFramework as LIFF,
    ErrorResponse
)

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
                assets = buttons_message()
                line_bot_api.reply_message(event.reply_token, FlexSendMessage(alt_text='我的資產', contents = assets ))
            elif event.message.text == '交易紀錄':
                transaction = Carousel_Template()
                line_bot_api.reply_message(event.reply_token, FlexSendMessage(alt_text='交易紀錄', contents = transaction))
            elif event.message.text == '我要開戶':
                createwallet = createWallet(event)
                line_bot_api.reply_message(event.reply_token,  TextSendMessage(alt_text='我要開戶', text = createwallet))
            elif event.message.text == '錢包帳戶':
                walletAddress = getWalletInfo(event)
                line_bot_api.reply_message(event.reply_token,  FlexSendMessage(alt_text='錢包帳戶',contents = walletAddress))
            elif event.message.text == '詳細資料':
                detailsInfo = details()
                line_bot_api.reply_message(event.reply_token,  FlexSendMessage(alt_text='錢包帳戶',contents = detailsInfo))
            elif event.message.text == '資產移轉':
                try:
                    line_bot_api.reply_message(event.reply_token, TextSendMessage(text='https://liff.line.me/1657597194-A0PEBQ1D'))
                except:
                    pass

            else:
                line_bot_api.reply_message(event.reply_token, TextSendMessage(text=event.message.text))
        return HttpResponse()
    
    else:
        return HttpResponseBadRequest()

# 我的資產
def buttons_message(event):
    getUid = event.source.user_id
    print(getUid)

    f = open('AsiaToken/Json/assets.json', encoding='utf-8')
    data = json.load(f)

    Balance = connection.accountBalance(getUid)
    data['body']['contents'][1]['contents'][0]['contents'][1]['text']= Balance[0]
    message = data
    return message

# 交易紀錄
def Carousel_Template(event):
    getUid = event.source.user_id
    print(getUid)
    
    f = open('AsiaToken/Json/transaction.json', encoding='utf-8')
    data = json.load(f)
    
    transactionInfo = connection.getAccountData(getUid)
    # data['contents']['body']['contents']['text'] = transactionInfo['from'] # from
    data['contents'][0]['body']['contents'][2]['contents'][1]['text'] = transactionInfo['to']  # to : 'userAddress
    data['contents'][0]['body']['contents'][3]['contents'][1]['text'] = transactionInfo['value'] # value : "count"
    data['contents'][0]['body']['contents'][4]['contents'][1]['text']= transactionInfo['time']  # time
    message = data
    return message

# 開戶
def createWallet(event):
    getUid = event.source.user_id
    print(getUid)

    userAdr = connection.signup(getUid) # call js API signup function
    get_img = qrcode.make(userAdr) # make this user QR code
    get_imgUrl = imgur.uploadImg(get_img, getUid) # call imgur.py get imgur's URL
    # get_imgUrl = 'https://i.imgur.com/TGpCxRE.png'
    time.sleep(2)
    message = connection.setImage(getUid, get_imgUrl) #call js API setImage function
    linkResult = line_bot_api.link_rich_menu_to_user(getUid, 'richmenu-002d04a75b219f9d4654552a2eeb6418')
    # get_img.show()
    return message # suess

# 取得帳戶
def getWalletInfo(event):
    getUid = event.source.user_id
    print(getUid)

    get_LevelDb_imgUrl = connection.getval(getUid)
    print(get_LevelDb_imgUrl)
    f = open('AsiaToken/Json/signup.json', encoding='utf-8')
    data = json.load(f)
    data['hero']['url'] = get_LevelDb_imgUrl['url'] # url
    data['contents']['text'] = get_LevelDb_imgUrl['address']  # address
    message = data
    return message

def details():
    f = open('AsiaToken/Json/details.json', encoding='utf-8')
    data = json.load(f)
    message = data
    return message



def test():
    f = open('AsiaToken/Json/test.json', encoding='utf-8')
    data = json.load(f)
    message = data
    return message

#  web render html
def liff(request):
    return render(request, 'liff.html')