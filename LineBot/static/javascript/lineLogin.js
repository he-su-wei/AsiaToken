var YourLiffAppId = '1657597194-A0PEBQ1D';

function initializeLiff(myLiffId) {
    
    console.log(myLiffId)
    liff.init({
        liffId:myLiffId,
    })
    .then(() => {
        if (!liff.isLoggedIn()) {
            console.log('你尚未登入過')
            liff.login({ redirectUri: 'https://21dc-49-213-161-66.jp.ngrok.io/liff'});
            alert(location.href)
        }else {
            console.log('你已登入過了')
        }
        //     liff.login({redirectUri : location.href})
        // }
        // liff.getProfile().then(function (e) {
        //     alert(e.userId)
        // });
    })
    .catch((err) => {
        alert(JSON.stringify(err));
        console.log('初始化失敗')
    });
}
$(document).ready(function () {
    //init LIFF
    console.log(YourLiffAppId)
    initializeLiff(YourLiffAppId);

    $('#ButtonScan').click(() => {
        liff.scanCodeV2()
        .then((result) => {
            //alert(JSON.stringify(result));
            console.log(result.value)
            // $('#field_info').val(ret.value);
        }, (err) => {
            alert(JSON.stringify(err));
        }
        );
    });

});