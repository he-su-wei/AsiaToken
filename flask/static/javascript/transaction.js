var YourLiffAppId = '1657672493-zOBZPaGR';
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
            liff.closeWindow();    
        }
    })
    .catch((err) => {
        alert(JSON.stringify(err));
        console.log('初始化失敗')
    });
}

