var YourLiffAppId = '1660664256-yODggrBq';
initializeLiff(YourLiffAppId)

// let userTransactionInfo = {address : '', value : 0}
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




