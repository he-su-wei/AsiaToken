const { Level } = require('level')

// Create a database
const crypto = require('crypto')
// const path = require('path')
// db_path = path.join('userDB/', args[0]);
const db = new Level('userDB/', { valueEncoding: 'json' });

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}


async function main(funcName, args) {
    var resResult;
    //U3d6836eb3653733cfefaa988ad86b11f
    
    switch (funcName) {
        case "newUser":
            if(args[0]){
                console.log("-- set address --");
                // userID = 'U3d6836eb3653733cfefaa988ad86b11f'
                hash = crypto.getHashes();
                let hexString = '0x'+crypto.createHash('sha512-256WithRSAEncryption').update(args[0]).digest('hex');

                console.log(args[0]);
                db.put(args[0], {'data': hexString}, function (err) {
                    if (err) {
                        resResult = "error";
                        return console.log('Oops!', err);
                    }else resResult = hexString
                })
                
            }else{
                resResult = "no key or no value";
            }
            break;
        case "setImage":
            if(args[0]){
                console.log("-- set image --");

                console.log(args[1]);
                db.put(args[0]+'url', {'data': args[1]}, function (err) {
                    if (err) {
                        resResult = "error";
                        return console.log('Oops!', err);
                    }else resResult = "Success";
                })
                
            }else{
                resResult = "no key or no value";
            }
            break;
        case "getVal":
            if(args[0]){
                console.log("-- get user info --");
               
                resResult=[]
                db.get(args[0], function (err, value) {
                    if (err) {
                        resResult = "error";
                        return console.log('Oops! Data does not exist', err);
                    }
                    console.log(value.data) // {'address': '', 'url': ''}
                    
                    resResult=value.data+",";
                })
                db.get(args[0]+'url', function (err, value) {
                    if (err) {
                        resResult = "error";
                        return console.log('Oops! Data does not exist', err);
                    }
                    
                    resResult+=value.data;
                })
                console.log(resResult);
            }else{
                resResult = "no key";
            }
            break;
        case "getAddress":
                // db_path = path.join('userDB/', args[0]);
                // db = new Level(db_path, { valueEncoding: 'json' });
                if(args[0]){
                    console.log("-- get user address --");
                   
                    resResult=[]
                    db.get(args[0], function (err, value) {
                        if (err) {
                            resResult = "error";
                            return console.log('Oops! Data does not exist', err);
                        }
                        console.log(value.data) // {'address': '', 'url': ''}
                        
                        resResult=value.data;
                    })
                    console.log(resResult);
                }else{
                    resResult = "no key";
                }
                break;
        default:
            break;
    }
    await sleep(4000);
    if(resResult != "error"){
        return {
            status: 200,
            data: resResult
        };
    }else{
        return {
            status: 500,
            data: resResult
        };
    }
    
}
module.exports = {
    /**
     * 連線Hyperledger Fabric Network執行智慧合約
     * @param {String} funcName: 智慧合約函式自訂別名
     * @param {String} userID: 智慧合約傳入參數陣列
     * @returns Object
     * @example executeChaincode("queryCar", ["car1"])
     * return {status: 200, data: {"brand":"toyota","carId":"car1","color":"white","docType":"car","model":"altis","owner":"Tom"}}
    */
    executeDBcode: function (funcName, userID) {
        return main(funcName, userID).then(function (rs) {
            return rs;
        });
    }
}

// newUser('U3d6836eb3653733cfefaa988ad86b11f', function(val){
//     console.log(val)
// });
// var hashval="";
// getVal('U3d6836eb3653733cfefaa988ad86b11f', function(val){
//     hashval = val;
//     console.log(hashval);
// });

//db.batch([{ type: 'put', key: 'b', value: 2 }])