var YourLiffAppId = '1657597194-mwWeOo6N';
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
              
                xmlHttp.open( "GET", 'https://5f88-210-63-208-183.jp.ngrok.io/scan?toAddress=' + getAddress + '&' + 'userId=' + e.userId ,  false ); // false for synchronous request
                xmlHttp.send();
                liff.closeWindow();
                return xmlHttp.responseText;
            });

            // return result.value;
        }, (err) => {
            alert(JSON.stringify(err));
        })
        .catch((err) => {
            console.log("error", err);
        });
        
};