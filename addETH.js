const Web3 = require('web3');

// Replace with your Alchemy or Infura WebSocket URL
const alchemyUrl = 'wss://eth-mainnet.g.alchemy.com/v2/ckHKl_4T_jKjywzZp4v0YB4R8n5K788J';
const web3 = new Web3(new Web3.providers.WebsocketProvider(alchemyUrl));

const account = '0xD532631672Be39c957Fea3C71145b5C07d8B3f22'; // Replace with your address
const privateKey = '0x5e8ae25ae7e32ceb8f4935587656617c8233a79c86bdfabc79b31e72d05fef91'; // Replace with your private key (keep it secure)
const beaconDepositContract = '0x00000000219ab540356cBB839Cbe05303d7705Fa';

async function sendDeposit() {
    const nonce = await web3.eth.getTransactionCount(account);

    const tx = {
        to: beaconDepositContract,
        value: web3.utils.toWei('0.1', 'ether'), // Amount to deposit
        gas: 21000, // Adjust as needed
        gasPrice: web3.utils.toWei('10', 'gwei'), // Adjust as needed
        nonce: nonce,
        chainId: 1 // Mainnet ID
    };

    // Sign the transaction
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

    // Send the transaction
    web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        .on('receipt', console.log)
        .on('error', console.error);
}

// Run the deposit function
sendDeposit();
