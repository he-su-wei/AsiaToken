var YourLiffAppId = '1657597194-A0PEBQ1D';

function initializeLiff(myLiffId) {
    
    console.log(myLiffId)
    liff.init({
        liffId:myLiffId,
    })
    .then(() => {
        if (!liff.isLoggedIn()) {
            console.log('你尚未登入過')
            liff.login({ redirectUri: location.href});
            console.log(location.href);

            liff.getProfile().then(function (e) {
                alert(e.userId);
            });
            return e
        }else {
            console.log('你已登入過了')
            console.log(e)
            return e
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
    initializeLiff(YourLiffAppId);
    liff.ready.then(() => {
        // do something you want when liff.init finishes
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


});