import './App.css';
import { HashConnect } from 'hashconnect'
import {} from '@hashgraph/sdk'


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

let hashconnect = new HashConnect();

const connectHashpack = async () => {
    if (accountId === '') {
        let initData = await hashconnect.init(appMetaData ,"testnet", false);
        console.log(initData)
        saveData.pairingString = initData.pairingString
        let state = await hashconnect.connect()
        saveData.topic = state

        console.log(`\nTopic is: ${saveData.topic}\n`)
        // console.log(`\npairingString is: ${saveData.pairingString}\n`)

        saveData.pairingString = hashconnect.generatePairingString(state, "testnet", false)

        const result = hashconnect.findLocalWallets()

        console.log(result)
        console.log(`\nTopic is: ${saveData.pairingString}\n`)
        hashconnect.connectToLocalWallet(saveData.pairingString)



        hashconnect.pairingEvent.once(pairingData => {
            pairingData.accountIds.forEach(id => {
                accountId = id
                console.log(accountId)
                console.log(`\nTopic is: ${saveData.topic}\n`)

            })
        })
    }

    else {
        alert(`Account ID: ${accountId} is already paired`)
    }
}


// const joinRaffle = async () => {

//     const provider = hashconnect.getProvider('testnet', saveData.topic, accountId)
//     const signer = hashconnect.getSigner(provider)

//     const addPlayer = await new ContractExecuteTransaction()
//         .setContractId(contractId)
//         .setGas(100000)
//         .setPayableAmount(1)
//         .setFunction("sendAndAddParticipant")
//         .freezeWithSigner(signer)

//     const result = await addPlayer.executeWithSigner(signer)

//     return result
// }

// export { connectHashpack}


function App() {
  
  return (
    <div className="App">
        <h1>NFT MARKETPLACE</h1>
        <div className="btn">
            
            <button className="connect" onClick={connectHashpack}>Hashpack wallet</button>
        
            <button className="connect"></button></div>
        
       
    </div>
  );
}

export default App;




