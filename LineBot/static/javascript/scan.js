var YourLiffAppId = '1657672493-6Dzrp38q';
initializeLiff(YourLiffAppId)

function initializeLiff(myLiffId) {
    liff.init({
        liffId:myLiffId, 
    })
    .then(() => {
        if (!liff.isLoggedIn()) {
            console.log('你尚未登入過')
            liff.login({ redirectUri: location.href});

            liff.getProfile().then(function (e) {
                console.log(e.userId);
            });
        }else {
            console.log('你已登入過了')
            liff.getProfile().then(function (e) {
                console.log('Your User ID :' + e.userId);
            });
            scan()
            
        }
    })
    .catch((err) => {
        alert(JSON.stringify(err));
        console.log('初始化失敗')
    });
}

function scan() {
    liff.scanCodeV2()
        .then((result) => {
            //alert(JSON.stringify(result));
            console.log(result.value);
            alert(result.value)
            getAddress = result.value
            
            liff.getProfile().then(function (e) {
                console.log(e.userId);
                var xmlHttp = new XMLHttpRequest();
              
                xmlHttp.open( "GET", 'https://2248-49-213-161-66.jp.ngrok.io/scan?toAddress=' + getAddress + '&' + 'userId=' + e.userId ,  false ); // false for synchronous request
                xmlHttp.send();
                sendInfo(result.value)
                liff.closeWindow();
                // return success;
            });

            // return result.value;
        }, (err) => {
            alert(JSON.stringify(err));
        })
        .catch((err) => {
            console.log("error", err);
    })
    
};

function sendInfo(address) {
    liff.sendMessages([
        {
            "type": "flex",
            "altText": "掃描交易地址",

            "body": {
            "type": "box",
            "layout": "vertical",
            "spacing": "md",
            "action": {
                "type": "uri",
                "uri": "https://linecorp.com"
            }
            },
            "contents": {
                "type": "bubble",
                "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                          "type": "text",
                          "text": "請確認交易資訊",
                          "wrap": true,
                          "color": "#aaaaaa",
                          "size": "xl",
                          "align": "center"
                        },
                        {
                          "type": "separator",
                          "margin": "md",
                        },
                        {
                          "type": "text",
                          "text": "hello, world",
                          "contents": [
                            {
                              "type": "span",
                              "text": "交易名稱 : ",
                              "weight": "bold"
                            },
                            {
                              "type": "span",
                              "text": "亞大幣"
                            }
                          ],
                          "margin": "xl"
                        },
                        {
                          "type": "text",
                          "text": "hello, world",
                          "contents": [
                            {
                              "type": "span",
                              "text": "交易數量 : ",
                              "weight": "bold"
                            },
                            {
                              "type": "span",
                              "text": "1"
                            }
                          ]
                        },
                        {
                          "type": "text",
                          "text": "hello, world",
                          "contents": [
                            {
                              "type": "span",
                              "text": "交易對象 : ",
                              "weight": "bold"
                            },
                            {
                              "type": "span",
                              "text": address
                            }
                          ]
                        }
                      ]
                },
                "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "button",
                        "style": "primary",
                        "color": "#905c44",
                        "margin": "none",
                        "action": {
                          "type": "uri",
                          "label": "移轉",
                          "uri": "https://liff.line.me/1657672493-zOBZPaGR"
                        }
                      }
                    ]
                }
            }
        },
    ])
    .then(() => {
        console.log("message sent");
    })
    .catch((err) => {
        console.log("error", err);
    }); 
}


