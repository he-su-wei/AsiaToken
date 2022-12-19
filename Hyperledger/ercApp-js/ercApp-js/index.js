const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());
// app.use(express.urlencoded({
//     extended: truenpm
// }));

// use bodyParser middleware 
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());

// setup static directory
app.use(express.static('./public'));

//偵測連線，並傳入一個callback function
const port = process.env.PORT || 8080;

// Server stsrt and listening specified port
app.listen(port, () => {
    console.info(`Listening on port ${port}...`);
    console.info(`Press Ctrl+C to terminate.`);
});


function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// ==== 設定API Server Router ====
// homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/" + "index.htm");
});

function setSignup(hashval, res){
    // hashval = "0x4fcc01b80691162e1fd58b32549bb60db495f9b16f5f9c02a5822ab51b4673fd";
        
    const args = [hashval];
    const connect = require('./lib/connect.js');
    connect.executeChaincode("newsignup", args).then(function (data) {
        console.log("Signup with chaincode success!");
        res.status(data.status).send(hashval);
    });
}

app.post('/signup', (req, res)=> {
    try{
        const userId = req.body.userID;
        // userId = userId.toString();
        const hashFn = require('./examples/indexDB.js');

        const datas = [userId];
        var hashval="";
        hashFn.executeDBcode('newUser', datas).then(function(data){
            hashval = data.data;
            console.log(hashval);
            setSignup(hashval, res);
            // res.status(data.status).send(hashval);
        });

        // sleep(5000);
        
    }catch (error){
        console.log("accountID error");
        console.error("message: "+ error.message);
    }
});

app.post('/setImage', (req, res) => {
    try {
        const userId = req.body.userID;
        const imageUrl = req.body.url;
        // userId = userId.toString();
        const hashFn = require('./examples/indexDB.js');

        const datas = [userId, imageUrl];
        var result="";
        hashFn.executeDBcode('setImage', datas).then(function(data){
            result = data.data;
            console.log("set image: "+result);
            res.status(data.status).send(result);
        });
    }catch(error){
        console.log("accountID error");
        console.error("message: "+ error.message);
    }
});

app.post('/getVal', (req, res)=> {
    try{
        const userId = req.body.userID;
        // userId = userId.toString();
        // console.log(typeof userId);
        const hashFn = require('./examples/indexDB.js');
        var result="";

        const datas = [userId];
        hashFn.executeDBcode('getVal', datas).then(function(data){
            result = data.data;
            console.log(result);
            res.status(data.status).send(result);
        });
    }catch (error){
        console.log("accountID error");
        console.error("message: "+ error.message);
    }
});

app.post('getUserAddress', (req, res) => {
    try{
        const userId = req.body.userID;
        const hashFn = require('./examples/indexDB.js');

        const datas = [userId];
        var result="";
        hashFn.executeDBcode('getAddress', datas).then(function(data){
            result = data.data;
            console.log(result);
            res.status(data.status).send(result);
        });

    }catch (error){
        console.log("accountID error");
        console.error("message: "+ error.message);
    }
});

function getDataFromBC(result, res){
    // result = "0x4fcc01b80691162e1fd58b32549bb60db495f9b16f5f9c02a5822ab51b4673fd";
    const args = [result];
    const connect = require('./lib/connect.js');
    connect.executeChaincode("getAccountData", args).then(function (data) {
        console.log("get account data with chaincode success!");
        res.status(data.status).send(data.data);
    });
}

app.post('/getAccountData', (req, res) => {
    try{
        const userId = req.body.userID;
        const hashFn = require('./examples/indexDB.js');

        const datas = [userId];
        var result="";
        hashFn.executeDBcode('getAddress', datas).then(function(data){
            result = data.data;
            getDataFromBC(result, res);
            console.log(result);
        });

    }catch (error){
        console.log("accountID error");
        console.error("message: "+ error.message);
    }
});

app.get('/accountID', (req, res) => {
    try {
        // //POST參數
        // const carId = req.body.carID;
        
        // //資料檢查
        // if (!carId) {
        //     console.error(`必要的傳入參數不存在請重新輸入`)
        //     throw new Error(`必要的傳入參數不存在請重新輸入`);
        // }

        const args = [];
        const connect = require('./lib/connect.js');
        connect.executeChaincode("accountID", args).then(function (data) {
            res.status(data.status).send(data.data);
        });

    } catch (error) {
        console.log("accountID error");
        console.error("message: "+ error.message);
        //console.error("stack: "+ error.stack);
        const errorObj = {
            status: 500, 
            message: error.message
        }
        //當網頁程式發生錯誤正確作法應回傳狀態碼400或500
        //此處因範例為了故意要將錯誤訊息顯示於網頁
        //因此仍回傳狀態碼200
        res.status(200).send(JSON.stringify(errorObj));
    } 
});

function getUserBalanceFromBC(result, res) {
    const args = [result];
    const connect = require('./lib/connect.js');
    connect.executeChaincode("getUserBalance", args).then(function (data) {
        res.status(data.status).send(data.data);
    });
}

app.post('/accountBalance', (req, res) => {
    try {
        //POST參數
        console.log(req.body.userID) 
        const accountId = req.body.userID;
        // accountId = "0x4fcc01b80691162e1fd58b32549bb60db495f9b16f5f9c02a5822ab51b4673fd";
        
        const hashFn = require('./examples/indexDB.js');

        const datas = [accountId];
        var result="";
        hashFn.executeDBcode('getAddress', datas).then(function(data){
            result = data.data;
            getUserBalanceFromBC(result, res);
            console.log(result);
        });

        //資料檢查
        if (!accountId) {
            console.error(`必要的傳入參數不存在請重新輸入`)
            throw new Error(`必要的傳入參數不存在請重新輸入`);
        }

    } catch (error) {
        console.log("accountBalance error");
        console.error("message: "+ error.message);
        //console.error("stack: "+ error.stack);
        const errorObj = {
            status: 500, 
            message: error.message
        }
        //當網頁程式發生錯誤正確作法應回傳狀態碼400或500
        //此處因範例為了故意要將錯誤訊息顯示於網頁
        //因此仍回傳狀態碼200
        res.status(200).send(JSON.stringify(errorObj));
    } 
});

function doUserTransfer(args, res){
    const connect = require('./lib/connect.js');
    connect.executeChaincode("userTransfer", args).then(function (data) {
        res.status(data.status).send(data.data);
    });
}


app.post('/userTransfer', (req, res) => {
    try {
        console.log(req.body.userID) 
        const accountId = req.body.userID;
        const addressTo = req.body.addressTo;
        const val = req.body.value;
        // accountId = "0x4fcc01b80691162e1fd58b32549bb60db495f9b16f5f9c02a5822ab51b4673fd";
        
        const hashFn = require('./examples/indexDB.js');

        const datas = [accountId];
        var result=[];
        hashFn.executeDBcode('getAddress', datas).then(function(data){
            result = [data.data, addressTo, val];
            doUserTransfer(result, res);
            console.log(result);
        });

        //資料檢查
        if (!accountId) {
            console.error(`必要的傳入參數不存在請重新輸入`)
            throw new Error(`必要的傳入參數不存在請重新輸入`);
        }

    } catch (error) {
        console.log("userTransfer error");
        console.error("message: "+ error.message);
        //console.error("stack: "+ error.stack);
        const errorObj = {
            status: 500, 
            message: error.message
        }
        //當網頁程式發生錯誤正確作法應回傳狀態碼400或500
        //此處因範例為了故意要將錯誤訊息顯示於網頁
        //因此仍回傳狀態碼200
        res.status(200).send(JSON.stringify(errorObj));
    } 
});


// -------------- Only for BC admin ----------- //
app.post('/mintAUT', (req, res) => {
    try {
        //POST參數
        const amount = req.body.amount;
        
        //資料檢查
        if (!amount) {
            console.error(`必要的傳入參數不存在請重新輸入`)
            throw new Error(`必要的傳入參數不存在請重新輸入`);
        }

        //設定參數陣列
        const args = [amount];
        //載入connect.js中介模組
        const connect = require('./lib/connect.js');
        //調用智慧合約函式
        connect.executeChaincode("mintAUT", args).then(function (data) {
            //將智慧合約執行結果回傳前端網頁
            res.status(data.status).send(data.data);
        });

    } catch (error) {
        console.log("mintAUT error");
        console.error("message: "+ error.message);
        //console.error("stack: "+ error.stack);
        const errorObj = {
            status: 500, 
            message: error.message
        }
        //當網頁程式發生錯誤正確作法應回傳狀態碼400或500
        //此處因範例為了故意要將錯誤訊息顯示於網頁
        //因此仍回傳狀態碼200
        res.status(200).send(JSON.stringify(errorObj));
    } 
});

app.get('/getBalance', (req, res) => {
    try {

        //設定參數陣列
        const args = [];
        //載入connect.js中介模組
        const connect = require('./lib/connect.js');
        //調用智慧合約函式
        connect.executeChaincode("getBalance", args).then(function (data) {
            //將智慧合約執行結果回傳前端網頁
            res.status(data.status).send(data.data);
        });

    } catch (error) {
        console.log("getBalance error");
        console.error("message: "+ error.message);
        //console.error("stack: "+ error.stack);
        const errorObj = {
            status: 500, 
            message: error.message
        }
        //當網頁程式發生錯誤正確作法應回傳狀態碼400或500
        //此處因範例為了故意要將錯誤訊息顯示於網頁
        //因此仍回傳狀態碼200
        res.status(200).send(JSON.stringify(errorObj));
    } 
});

app.post('/transferAUT', (req, res) => {
    try {
        //POST參數
        const address = req.body.address;
        const value = req.body.value;
        
        //資料檢查
        if (!address || !value) {
            console.error(`必要的傳入參數不存在請重新輸入`)
            throw new Error(`必要的傳入參數不存在請重新輸入`);
        }

        //設定參數陣列
        const args = [address, value];
        //載入connect.js中介模組
        const connect = require('./lib/connect.js');
        //調用智慧合約函式
        connect.executeChaincode("transferAUT", args).then(function (data) {
            //將智慧合約執行結果回傳前端網頁
            res.status(data.status).send(data.data);
        });

    } catch (error) {
        console.log("transferAUT error");
        console.error("message: "+ error.message);
        //console.error("stack: "+ error.stack);
        const errorObj = {
            status: 500, 
            message: error.message
        }
        //當網頁程式發生錯誤正確作法應回傳狀態碼400或500
        //此處因範例為了故意要將錯誤訊息顯示於網頁
        //因此仍回傳狀態碼200
        res.status(200).send(JSON.stringify(errorObj));
    } 
});



// catch 404 and forward to error handler
//app.use(function (req, res) {
app.use((req, res, next) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 Resource Not Found.');
});

// error handler
app.use((err, req, res, next) => {
    console.error(err.message);
    console.error(err.stack);
    res.status(500);
    res.send('500 Server Error.');
});

module.exports = app;