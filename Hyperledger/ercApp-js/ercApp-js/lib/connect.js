//const { throws } = require('assert');
const { Wallets, Gateway, Transaction } = require('fabric-network');
const EventStrategies = require('fabric-network/lib/impl/event/defaulteventhandlerstrategies'); 

const fs = require('fs');
const path = require('path');

//for VSCode Local Fabric Network
// const connectionProfile = "2Org2PeerOrg1GatewayConnection.json";
// const orgName = "Org1";
// const userIdentity = "Org1 Admin";
// const channelName = "mychannel";
// const contrcatName = "mycar";

//for Fabric Dev Network
const connectionProfile = "connection.json";
const orgName = "org1.asia.csie.com";
const userIdentity = "User2@org1.asia.csie.com";
const channelName = "token-channel";
const contrcatName = "erc20";

//const ccpPath = path.resolve(__dirname, 'connection.json');
const ccpPath = path.resolve(__dirname, '..', connectionProfile);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);


/**
 * Perform a sleep -- asynchronous wait
 * @param ms the time in milliseconds to sleep for
 */
 function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 顯示交易內容
 * @param {*} transactionData 
 */
function showTransactionData(transactionData) {
    console.log(`*** Transaction Data ***`);

	const creator = transactionData.actions[0].header.creator;
	console.log(`    - submitted by: ${creator.mspid}-${creator.id_bytes.toString('hex')}`);

	for (const endorsement of transactionData.actions[0].payload.action.endorsements) {
		console.log(`    - endorsed by: ${endorsement.endorser.mspid}-${endorsement.endorser.id_bytes.toString('hex')}`);
	}

	const chaincode = transactionData.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec;
	console.log(`    - chaincode: ${chaincode.chaincode_id.name}`);
	console.log(`    - function: ${chaincode.input.args[0].toString()}`);

	for (let x = 1; x < chaincode.input.args.length; x++) {
		console.log(`    - arg[${x}]: ${chaincode.input.args[x].toString()}`);
	}

    console.log(``);
}

/**
 * 連線Hyperledger Fabric Network執行智慧合約
 * @param {String} funcName: 智慧合約函式自訂別名
 * @param {String[]} args: 智慧合約傳入參數陣列
 * @returns Object
 * @example executeChaincode("queryCar", ["car1"])
 * return {status: 200, data: {"brand":"toyota","carId":"car1","color":"white","docType":"car","model":"altis","owner":"Tom"}}
*/
async function main(funcName, args) {
    try {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet', orgName);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        //console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        //const userExists = await wallet.get('User1@org1.asia.csie.com');
        const userExists = await wallet.get(userIdentity);
        if (!userExists) {
            console.log(`An identity for the user ${userIdentity} does not exist in the wallet`);
            //return { status: "500", data: { error: { status: 500, message: "沒有合約帳號！" } } };
            throw new Error(`使用者憑證不存在！`);
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            //identity: 'User1@org1.asia.csie.com', 
            identity: userIdentity,
            //discovery: { enabled: true, asLocalhost: false, eventHandlerOptions: EventStrategies.MSPID_SCOPE_ALLFORTX }
            discovery: { enabled: true, asLocalhost: true, eventHandlerOptions: EventStrategies.NONE }
        });

        // Get the network (channel) our contract is deployed to.
        //const network = await gateway.getNetwork('dev-channel');
        const network = await gateway.getNetwork(channelName);

        // Get the contract from the network.
        //const contract = network.getContract('myasset');
        const contract = network.getContract(contrcatName);

        // setup receive event
        let listener;
        let blockListener; 

        try {
            // create a contract listener
            listener = async (event) => {

                const eventPlayload = JSON.parse(event.payload.toString('utf8'));
                //console.log(`Contract Event Received: ${event.eventName} - ${JSON.stringify(eventPlayload)}`);
                console.log(`*** Contract Event Received ***`);
                console.log(`*** Event: ${event.eventName}, Playload: ${JSON.stringify(eventPlayload)}`);

                const eventTransaction = event.getTransactionEvent();
                console.log(`*** transaction: ${eventTransaction.transactionId}, status:${eventTransaction.status}`);

                const eventBlock = eventTransaction.getBlockEvent();
                console.log(`*** block: ${eventBlock.blockNumber.toString()}`);
                console.log(``);

            };

            console.log(`### Start contract event stream to peer in Org1`);
            await contract.addContractListener(listener);
        } catch (eventError) {
            console.error(`Failed: Setup contract events - ${eventError}`);
        }

        try {
            // create a block listener
            blockListener = async (event) => {
                //This block event represents the current top block of the ledger.
                //All block events after this one are events that represent new blocks added to the ledger
                console.log(`### Block Event Received - block number: ${event.blockNumber.toString()}`);

                const transEvents = event.getTransactionEvents();
                for (const transEvent of transEvents) {
                    console.log(`*** transaction event: ${transEvent.transactionId}`);
                    if (transEvent.privateData) {
                        for (const namespace of transEvent.privateData.ns_pvt_rwset) {
                            console.log(`    - private data: ${namespace.namespace}`);
                            for (const collection of namespace.collection_pvt_rwset) {
                                console.log(`     - collection: ${collection.collection_name}`);
                                if (collection.rwset.reads) {
                                    for (const read of collection.rwset.reads) {
                                        console.log(`       - read set - key: ${read.key}  value:${read.value.toString()}`);
                                    }
                                }

                                if (collection.rwset.writes) {
                                    for (const write of collection.rwset.writes) {
                                        console.log(`      - write set - key:${write.key} is_delete:${write.is_delete} value:${write.value.toString()}`);
                                    }
                                }
                            }
                        }
                    }

                    if (transEvent.transactionData) {
                        showTransactionData(transEvent.transactionData);
                    }
                }
            };
            // now start the client side event service and register the listener
            console.log(`### Start private data block event stream to peer in Org1`);
            await network.addBlockListener(blockListener, {type: 'private'});
        } catch (eventError) {
            console.error(`Failed: Setup block events - ${eventError}`);
        }

        // Submit the specified transaction.
        // 智慧合約回傳值為JSON String
        let resResult;
        let address = "";
        let amount = "";
        let value = "";
        let addressTo = "";
        let addressFrom = "";
        
        switch (funcName) {
            case "newsignup":
                address = args[0];
                console.log(`evaluateTransaction for chaincode signup`);
                resResult = await contract.submitTransaction("signup", address);
                break;
            
            case "mintAUT":
                amount = args[0];
                console.log(`evaluateTransaction for chaincode Mint`);
                resResult = await contract.submitTransaction("Mint", amount);
                break;
            
            case "getBalance":
                address = [];
                console.log(`evaluateTransaction for chaincode ClientAccountBalance`);
                resResult = await contract.evaluateTransaction("ClientAccountBalance", address);
                break;

            case "transferAUT":
                address = args[0];
                value = args[1];
                console.log(`evaluateTransaction for chaincode Transfer`);
                resResult = await contract.submitTransaction("Transfer", address, value);
                break;
            
            case "getAccountData":
                address = args[0];
                console.log(`evaluateTransaction for chaincode getTransactionData`);
                resResult = await contract.evaluateTransaction("getTransactionData", address);

                break;

            case "getUserBalance":
                address = args[0];
                console.log(`evaluateTransaction for chaincode BalanceOf`);
                resResult = await contract.evaluateTransaction("BalanceOf", address);
                break;

            case "userTransfer":
                // console.log(args);
                addressFrom = args[0];
                val = args[1];
                addressTo = args[2];

                console.log(`evaluateTransaction for chaincode TransferFrom`);
                resResult = await contract.submitTransaction("TransferFrom", addressFrom, addressTo, val);
                break;

            default:
                break;
        }

        console.log(`Wait for event commit...`);
        await sleep(5000);
        console.log(`Execute Result: ${resResult}`);
        console.log(``);

        // remove listener
        contract.removeContractListener(listener);
		network.removeBlockListener(blockListener);
        
        // Disconnect from the gateway.
        //gateway.disconnect();

        //當智慧合約發生錯誤正確作法應回傳狀態碼500
        //此處因範例為了故意要將錯誤訊息顯示於網頁
        //因此不論智慧合約執行狀態仍回傳狀態碼200
        return {
            status: 200,
            data: resResult
        };

    } catch (error) {
        console.error(`Failed to connect fabric network: `);
        console.error("message: " + error.message);
        console.error("stack: " + error.stack);
        const errorObj = {
            status: 500,
            message: "智慧合約連線錯誤!"
        };

        //當網頁程式發生錯誤正確作法應回傳狀態碼400或500
        //此處因範例為了故意要將錯誤訊息顯示於網頁
        //因此仍回傳狀態碼200
        return {
            status: 200,
            data: JSON.stringify(errorObj)
        };
    }
}

module.exports = {
/**
 * 連線Hyperledger Fabric Network執行智慧合約
 * @param {String} funcName: 智慧合約函式自訂別名
 * @param {String[]} args: 智慧合約傳入參數陣列
 * @returns Object
 * @example executeChaincode("queryCar", ["car1"])
 * return {status: 200, data: {"brand":"toyota","carId":"car1","color":"white","docType":"car","model":"altis","owner":"Tom"}}
*/
    executeChaincode: function (funcName, args) {
        return main(funcName, args).then(function (rs) {

            return rs;
        });
    }
}
