const Web3 = require('web3');
const fs = require('fs');

// Replace with your Alchemy API key
const alchemyUrl = 'wss://eth-mainnet.g.alchemy.com/v2/ckHKl_4T_jKjywzZp4v0YB4R8n5K788J';

// Initialize Web3 with the WebSocket provider
const web3 = new Web3(new Web3.providers.WebsocketProvider(alchemyUrl));

// Beacon Deposit Contract address
const BEACON_DEPOSIT_CONTRACT = '0x00000000219ab540356cBB839Cbe05303d7705Fa';
const DEPOSITS_FILE = './deposits.json';

// Test connection by getting the latest block number
web3.eth.getBlockNumber()
  .then(blockNumber => {
    console.log('Connected to Ethereum. Current block number:', blockNumber);
  })
  .catch(err => {
    console.error('Error connecting to Ethereum:', err);
  });

// Function to save deposit details to a JSON file
function saveDepositDetails(tx, timestamp) {
    const deposit = {
        blockNumber: tx.blockNumber,
        blockTimestamp: timestamp,
        sender: tx.from,
        amount: web3.utils.fromWei(tx.value, 'ether'), // Convert from Wei to ETH
        txHash: tx.hash,
    };

    // Read existing deposits from file
    let deposits = [];
    if (fs.existsSync(DEPOSITS_FILE)) {
        const data = fs.readFileSync(DEPOSITS_FILE);
        deposits = JSON.parse(data);
    }

    // Add new deposit
    deposits.push(deposit);

    // Write updated deposits back to the file
    fs.writeFileSync(DEPOSITS_FILE, JSON.stringify(deposits, null, 2));

    console.log('Deposit details saved:', deposit);
}

// Subscribe to new block headers
web3.eth.subscribe('newBlockHeaders', async (error, blockHeader) => {
    if (error) {
        console.error('Error subscribing to new blocks:', error);
        return;
    }

    console.log('New block:', blockHeader.number);
    
    // Fetch full block details to get transactions
    try {
        const block = await web3.eth.getBlock(blockHeader.number, true); // `true` to get full transaction objects
        block.transactions.forEach((tx) => {
            // Check if the transaction interacts with the Beacon Deposit Contract
            if (tx.to && tx.to.toLowerCase() === BEACON_DEPOSIT_CONTRACT.toLowerCase()) {
                console.log('Deposit transaction found:', tx);
                saveDepositDetails(tx, block.timestamp); // Save deposit details
            }
        });
    } catch (err) {
        console.error('Error fetching block:', err);
    }
});

// Handle WebSocket errors and reconnections
web3.currentProvider.on('error', (err) => {
    console.error('WebSocket Error:', err);
});

web3.currentProvider.on('end', (err) => {
    console.error('WebSocket connection ended:', err);
});
