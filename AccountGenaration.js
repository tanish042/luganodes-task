const Web3 = require('web3');

// Initialize a web3 instance (not connected to any network)
const web3 = new Web3();

// Create a new Ethereum account
const account = web3.eth.accounts.create();

// Display the account address and private key
console.log('New Ethereum Account Address:', account.address);
console.log('Private Key (Keep this secret!):', account.privateKey);