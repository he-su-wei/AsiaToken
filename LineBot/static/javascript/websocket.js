// var myjs = require('./lineLogin.js');
var YourLiffAppId = '1657597194-A0PEBQ1D';

const websocket = new WebSocket("ws://localhost:5268/"); 
// const websocket = new WebSocket("ws://120.108.111.231:5268/"); 

websocket.onopen = function () {
    console.log('already bconnet ws');
    initializeLiff(YourLiffAppId);
}

function sendData() {
    let user = 'U027ad460026a290ca754a2229b4ca327'
    // let user = getprofile()
    // console.log(user)
    let AUT_val = document.getElementById("AUT-value").value
    let addressId = document.getElementById("to-address").value
    
    const event = {
        userId : user,
        count : AUT_val,
        walletAddress : addressId,
    }

    websocket.send(JSON.stringify(event));
    alert("交易中")
}

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
        }else {
            console.log('你已登入過了')
        }
        // liff.getProfile().then(function (e) {
        //     console.log("userid = " +  e.userId);
        // });
    }) 
    .catch((err) => {
        alert(JSON.stringify(err));
        console.log('初始化失敗')
    });
}

function getprofile(){
    liff.getProfile().then(function (profile) {
        const userId = profile.userId;
        const name = profile.displayName;
        var dataID = console.log("userid = " +  userId);
        return userId
    });
    
}

function scan(){
    const liffId = YourLiffAppId;
    liff.init({ liffId });
    liff.ready.then(() => {
        liff.scanCodeV2().then((result) => {
            // result = { value: "" }
            alert(result)
        })
        .catch((error) => {
            console.log("error", error);
        });
    })

}