const Web3 = require('web3');

// Replace with your Alchemy or Infura WebSocket URL
const alchemyUrl = 'wss://eth-mainnet.g.alchemy.com/v2/ckHKl_4T_jKjywzZp4v0YB4R8n5K788J';
const web3 = new Web3(new Web3.providers.WebsocketProvider(alchemyUrl));

const account = '0x9C06a062daD007f4CB1fAF60007c31f85f8A44C8'; // Replace with your Ethereum address

web3.eth.getBalance(account)
    .then(balance => {
        console.log('Account Balance:', web3.utils.fromWei(balance, 'ether'), 'ETH');
    })
    .catch(err => {
        console.error('Error fetching balance:', err);
    });
