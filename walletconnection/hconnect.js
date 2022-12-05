import { HashConnect } from 'hashconnect'

import {
    ContractId,
    ContractExecuteTransaction
} from '@hashgraph/sdk'

// sports nft same password
const contractIdStr = '0.0.48939753'
const contractId = ContractId.fromString(contractIdStr)

let accountId = ""

let saveData = {
    topic: "",
    pairingString: "",
    privateKey: "",
    pairedWalletData: null,
    pairedAccounts: []
}

let appMetaData = {
    name: 'NFT AIRDROP',
    description: 'The first global decentralised sport NFT Marketplace',
}

let hashconnect = new HashConnect()

const connectHashpack = async () => {
    if (accountId === '') {
        let initData = await hashconnect.init(appMetaData)
        saveData.privateKey = initData.privKey

        let state = await hashconnect.connect()
        saveData.topic = state.topic

        console.log(`\nTopic is: ${saveData.topic}\n`)

        saveData.pairingString = hashconnect.generatePairingString(state, "testnet", false)

        const result = hashconnect.findLocalWallets()

        console.log(result + ' result')

        hashconnect.connectToLocalWallet(saveData.pairingString)



        hashconnect.pairingEvent.once(pairingData => {
            pairingData.accountIds.forEach(id => {
                accountId = id
                console.log(accountId)
            })
        })
    }

    else {
        alert(`Account ID: ${accountId} is already paired`)
    }
}


const joinRaffle = async () => {

    const provider = hashconnect.getProvider('testnet', saveData.topic, accountId)
    const signer = hashconnect.getSigner(provider)

    const addPlayer = await new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        .setPayableAmount(1)
        .setFunction("sendAndAddParticipant")
        .freezeWithSigner(signer)

    const result = await addPlayer.executeWithSigner(signer)

    return result
}

export { connectHashpack, joinRaffle }



















// THIS IS THE OLD CODE WHICH USED SOLELY HTS


// const sendTransaction = async (operatorIdImp, operatorKeyImp, treasuryIdImp, treasuryKeyImp) => {
//     const operatorId = AccountId.fromString(operatorIdImp)
//     const operatorKey = PrivateKey.fromString(operatorKeyImp)
//     const treasuryId = AccountId.fromString(treasuryIdImp)
//     const treasuryKey = PrivateKey.fromString(treasuryKeyImp)
//     const client = Client.forTestnet().setOperator(operatorId, operatorKey);

//     if (accountId !== '') {

//         const provider = hashconnect.getProvider('testnet', saveData.topic, accountId)

//         const signer = hashconnect.getSigner(provider)

//         // Handle transfer
//         const receiverKey = treasuryKey
//         const receiverPub = receiverKey.publicKey

//         const trans = await new TransferTransaction()
//             .addHbarTransfer(AccountId.fromString(accountId), Hbar.from(-50))
//             .addHbarTransfer(treasuryId, Hbar.from(50))
//             .freezeWithSigner(signer)

//         let res = await trans.executeWithSigner(signer)

//         console.log(res)

//         let newId = TransactionId.generate(accountId)
//         transaction.setTransactionId(newId)

//         transaction = transaction.freezeWith(client)
//         let txBytes = transaction.toBytes()

//         let sig = receiverKey.signTransaction(Transaction.fromBytes(txBytes))
//         let out = transaction.addSignature(receiverPub, sig)
//         let outBytes = out.toBytes()

//         const transData = {
//             topic: saveData.topic,
//             byteArray: outBytes,
//             metadata: {
//                 accountToSign: accountId,
//                 returnTransaction: false
//             }
//         }

//         const sendTxRes = await hashconnect.sendTransaction(saveData.topic, transData)

//         if (sendTxRes.success) {
//             // Handle mint NFT

//             let mintTx = await new TokenMintTransaction()
//                 .setTokenId(TokenId.fromString(ticketTokenId))
//                 .setMetadata(['Hashraffle Test Raffle 1'])
//                 .freezeWith(client)

//             let mintTxSign = await mintTx.sign(operatorKey)

//             let mintTxSubmit = await mintTxSign.execute(client)

//             let mintRx = await mintTxSubmit.getReceipt(client)

//             const serialNumber = mintRx.serials[0].low

//             console.log(`- Created NFT 0.0.34211238 with serial: ${mintRx.serials[0].low} \n`)



//             // Handle associate NFT

//             let newId1 = TransactionId.generate(accountId)

//             let associateTx = await new TokenAssociateTransaction()
//                 .setAccountId(AccountId.fromString(accountId))
//                 .setTokenIds([TokenId.fromString(ticketTokenId)])
//                 .setTransactionId(newId1)
//                 .freezeWith(client)

//             let associateTxBytes = associateTx.toBytes()


//             const transData1 = {
//                 topic: saveData.topic,
//                 byteArray: associateTxBytes,
//                 metadata: {
//                     accountToSign: accountId,
//                     returnTransaction: false
//                 }
//             }

//             const result = await hashconnect.sendTransaction(saveData.topic, transData1)

//             // Handle NFT transfer
//             let tokenTransferTx = await new TransferTransaction()
//                 .addNftTransfer(TokenId.fromString(ticketTokenId), serialNumber, treasuryId, AccountId.fromString(accountId))
//                 .freezeWith(client)
//                 .sign(treasuryKey)

//             let tokenTransferSubmit = await tokenTransferTx.execute(client);
//             let tokenTransferRx = await tokenTransferSubmit.getReceipt(client);

//             console.log(`\n- NFT transfer from Treasury to you: ${tokenTransferRx.status} \n`);

//             tokenTransferRx.status._code === 22
//                 ? alert('NFT lottery ticket has been transferred successfully')
//                 : alert('NFT lottery ticket transfer failed.')

//             // Check the balance of the treasury account after the transfer
//             var balanceCheckTx = await new AccountBalanceQuery().setAccountId(treasuryId).execute(client);
//             console.log(`- Treasury balance: ${balanceCheckTx.tokens._map.get(ticketTokenId)} NFTs of ID ${ticketTokenId}`);

//             // Check the balance of Alice's account after the transfer
//             var balanceCheckTx = await new AccountBalanceQuery().setAccountId(AccountId.fromString(accountId)).execute(client);
//             console.log(`- Your balance: ${balanceCheckTx.tokens._map.get(ticketTokenId)} NFTs of ID ${ticketTokenId}`);
//         } else {
//             alert('There has been an error sending the payment.')
//         }

//     }

//     else {
//         alert('You have not paired your wallet')
//     }

// }


// async function main() {



//     let useAccountId = AccountId.fromString(accountId)
//     let tokenId = TokenId.fromString('0.0.34274666')

//     //Get the contract bytecode
//     const bytecode = htsContract.data.bytecode.object;
//     console.log(bytecode)

//     //Create a file on Hedera and store the hex-encoded bytecode
//     const fileCreateTx = new FileCreateTransaction()
//         .setKeys([treasuryKey])
//         .freezeWith(client)
//     const fileCreateSign = await fileCreateTx.sign(treasuryKey)

//     //Submit the file to the Hedera test network signing with the transaction fee payer key specified with the client
//     const submitTx = await fileCreateSign.execute(client);

//     //Get the receipt of the file create transaction
//     const fileReceipt = await submitTx.getReceipt(client);

//     //Get the file ID from the receipt
//     const bytecodeFileId = fileReceipt.fileId;

//     //Log the file ID
//     console.log("The smart contract bytecode file ID is " + bytecodeFileId)

//     // Append content to file
//     const fileAppendTx = new FileAppendTransaction()
//         .setFileId(bytecodeFileId)
//         .setContents(bytecode)
//         .setMaxChunks(10)
//         .freezeWith(client)

//     const fileAppendSign = await fileAppendTx.sign(treasuryKey)

//     const fileAppendSubmit = await fileAppendSign.execute(client)
//     const fileAppendRx = await fileAppendSubmit.getReceipt(client)

//     console.log(fileAppendRx)

//     console.log(fileAppendRx)

//     //Deploy the contract instance
//     const contractTx = await new ContractCreateTransaction()
//         //The bytecode file ID
//         .setBytecodeFileId(bytecodeFileId)
//         //The max gas to reserve
//         .setGas(3000000)

//     //Submit the transaction to the Hedera test network
//     const contractResponse = await contractTx.execute(client);

//     //Get the receipt of the file create transaction
//     const contractReceipt = await contractResponse.getReceipt(client);

//     //Get the smart contract ID
//     const newContractId = contractReceipt.contractId;

//     //Log the smart contract ID
//     console.log("The smart contract ID is " + newContractId);


//     // //Associate the token to an account using the HTS contract
//     // const associateToken = new ContractExecuteTransaction()
//     //     //The contract to call
//     //     .setContractId(newContractId)
//     //     //The gas for the transaction
//     //     .setGas(2000000)
//     //     //The contract function to call and parameters to pass
//     //     .setFunction("tokenAssociate", new ContractFunctionParameters()
//     //         //The account ID to associate the token to
//     //         .addAddress(accountIdTest.toSolidityAddress())
//     //         //The token ID to associate to the account
//     //         .addAddress(tokenId.toSolidityAddress()));

//     // //Sign with the account key and submit to the Hedera network
//     // const signTx = await associateToken.freezeWith(client).sign(accountKeyTest);

//     // //Submit the transaction
//     // const submitAssociateTx = await signTx.execute(client);

//     // //Get the receipt
//     // const txReceipt = await submitAssociateTx.getReceipt(client);

//     // //Get transaction status
//     // const txStatus = txReceipt.status

//     // console.log("The associate transaction was " + txStatus.toString())

//     // //Get the token associate transaction record
//     // const childRecords = new TransactionRecordQuery()
//     //     //Set children equal to true for child records
//     //     .setIncludeChildren(true)
//     //     //The parent transaction ID
//     //     .setTransactionId(submitAssociateTx.transactionId)
//     //     .setQueryPayment(new Hbar(10))
//     //     .execute(client);


//     // console.log("The transaction record for the associate transaction" + JSON.stringify((await childRecords).children));

//     // //The balance of the account
//     // const accountBalance = new AccountBalanceQuery()
//     //     .setAccountId(accountIdTest)
//     //     .execute(client);

//     // console.log("The " + tokenId + " should now be associated to my account: " + (await accountBalance).tokens.toString());




//     //Transfer the new token to the account
//     //Contract function params need to be in the order of the paramters provided in the tokenTransfer contract function
//     const tokenTransfer = new ContractExecuteTransaction()
//         .setContractId(newContractId)
//         .setGas(2000000)
//         .setFunction("tokenTransfer", new ContractFunctionParameters()
//             //The ID of the token
//             .addAddress(tokenId.toSolidityAddress())
//             //The account to transfer the tokens from
//             .addAddress(treasuryId.toSolidityAddress())
//             //The account to transfer the tokens to
//             .addAddress(useAccountId.toSolidityAddress())
//             //The number of tokens to transfer
//             .addInt64(1));

//     //Sign the token transfer transaction with the treasury account to authorize the transfer and submit
//     const signTokenTransfer = await tokenTransfer.freezeWith(client).sign(treasuryKey);

//     //Submit transfer transaction
//     const submitTransfer = await signTokenTransfer.execute(client);

//     const transferRecord = await submitTransfer.getRecord(client)
//     const recQuery = await new TransactionRecordQuery()
//         .setTransactionId(transferRecord.transactionId)
//         .setIncludeChildren(true)
//         .execute(client)

//     console.log('no string --- \n' + recQuery)
//     console.log('string --- \n' + recQuery.toString())


//     //Get transaction status
//     const transferTxStatus = await (await submitTransfer.getReceipt(client)).status;

//     //Get the transaction status
//     console.log("The transfer transaction status " + transferTxStatus.toString());

//     //Verify the account received the 100 tokens
//     const newAccountBalance = new AccountBalanceQuery()
//         .setAccountId(useAccountId)
//         .execute(client);

//     console.log("My new account balance is " + (await newAccountBalance).tokens.toString());
// }

// export { connectHashpack, sendTransaction, main }


































































































































// import {hashconnect} from '../walletconnection/hconnect.js'

// const connectWallet = async ()=>{
//     let hashconnect = new HashConnect();

//     const appMetadata = {
//         name: "NFT SPORTS",
//         description: "A NFT SPORTS ",
        
//     }
//     let initData = await this.hashconnect.init(appMetadata, "testnet", false);
// }





// //




























































































// // import { HashConnect } from 'hashconnect'

// // let hashconnect = new HashConnect();

// // let appdata = {
// //     name: "hconnect example",
// //     description: "An example hedera dApp"
// // }

// // export const pairHashpack = async () => {
// //     let initData = await hashconnect.init(appdata, "testnet", false);

// //     hashconnect.foundExtensionEvent.once((walletMetadata) => {
// //         hashconnect.connectToLocalWallet(initData.pairingString, walletMetadata);
// //     })

// //     hashconnect.pairingEvent.once((pairingData) => {
// //         console.log('wallet paired')
// //         console.log(pairingData)

// //         const accountId = document.getElementById('accountid')
// //         accountId.innerHTML = pairingData.accountIds[0]
// //     })

// //     return initData
    

// // }
