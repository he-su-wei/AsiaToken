const websocket = new WebSocket("ws://localhost:5268/"); 

websocket.onopen = function () {
    console.log('already bconnet ws');
}

function sendData() {
    let AUT_val = document.getElementById("AUT-value").value
    let addressId = document.getElementById("to-address").value
    
    const event = {
        count : AUT_val,
        walletAddress : addressId,
        
    }

    websocket.send(JSON.stringify(event));
    alert("交易中")
}