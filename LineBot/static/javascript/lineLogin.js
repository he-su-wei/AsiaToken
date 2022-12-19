var YourLiffAppId = '1657672493-Ed95y1Rq';
initializeLiff(YourLiffAppId)
function initializeLiff(myLiffId) {
    
    console.log(myLiffId)
    liff.init({
        liffId:myLiffId,
    })
    .then(() => {
        if (!liff.isLoggedIn()) {
            console.log('你尚未登入過!!')
            liff.login({ redirectUri: location.href});
            console.log(location.href);

            liff.getProfile().then(function (e) {
                alert(e.userId);
            });
        }else {
            console.log('你已登入過了')

        }
    })
    .catch((err) => {
        alert(JSON.stringify(err));
        console.log('初始化失敗')
    });
}

function requestGet(){
    const AUT_Sum = document.getElementById("AUT-value").value;
    console.log(AUT_Sum)
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", 'https://2248-49-213-161-66.jp.ngrok.io/liff?AUT-value=' + AUT_Sum , false ); // false for synchronous request
    xmlHttp.send()


    // return xmlHttp.responseText;

}

$('#ButtonScan').click(() => {
    requestGet()
    liff.sendMessages([
        {
            "type": "flex",
            "altText": "掃描交易地址",
            "contents": {
                "type": "bubble",
                "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                    {
                        "type": "text",
                        "text": "掃描交易地址",
                        "weight": "bold",
                        "size": "xxl",
                        "margin": "none",
                        "align": "center"
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
                        "margin": "xxl",
                        "action": {
                        "type": "uri",
                        "label": "掃描",
                        "uri": "https://liff.line.me/1657672493-6Dzrp38q"
                        }
                    }
                    ]
                }
            }
        },
        
    ])
    
    .then(() => {
        liff.closeWindow();
        console.log("message sent");
    })
    .catch((err) => {
        console.log("error", err);
    });

});