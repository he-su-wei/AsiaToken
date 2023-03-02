var YourLiffAppId = '1660664256-4yKZZ6wy';
initializeLiff(YourLiffAppId);

function initializeLiff(myLiffId) {
    liff.init({
        liffId:myLiffId,
    })
    .then(() => {
        console.log(myLiffId)
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
        console.log(myLiffId)
        alert(JSON.stringify(err));
        console.log('123')
    });
}

function requestGet(){
    const AUT_Sum = document.getElementById("AUT-value").value;
    console.log(AUT_Sum)
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", 'https://token.asia.edu.tw/liff?AUT-value=' + AUT_Sum , false ); // false for synchronous request
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
                        "uri": "https://liff.line.me/1660664256-yODggrBq"
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