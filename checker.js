const { ethers } = require("ethers");
const axios = require("axios");
require("dotenv").config();

// Load config from .env
const RPC_URL = process.env.RPC_URL;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const WALLET_ADDRESS = process.env.WALLET_ADDRESS_TO_CHECK;

// Airdrop criteria constants
const MIN_TX_COUNT = 10;
const MIN_WALLET_AGE_DAYS = 90;
const UNISWAP_V2_ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

if (!RPC_URL || !ETHERSCAN_API_KEY || !WALLET_ADDRESS) {
    console.error("Error: Missing required environment variables.");
    process.exit(1);
}

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

// Helper to call Etherscan API
async function getTxHistory(address) {
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`;
    const response = await axios.get(url);
    return response.data.result;
}

// --- CHECK FUNCTIONS ---

async function checkWalletAge(transactions) {
    if (transactions.length === 0) return { met: false, age: 0 };
    
    const firstTxTimestamp = parseInt(transactions[0].timeStamp);
    const firstTxDate = new Date(firstTxTimestamp * 1000);
    const ageInMs = Date.now() - firstTxDate.getTime();
    const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));

    return { met: ageInDays >= MIN_WALLET_AGE_DAYS, age: ageInDays };
}

async function checkTxCount(address) {
    const count = await provider.getTransactionCount(address);
    return { met: count >= MIN_TX_COUNT, count: count };
}

async function checkDeFiInteraction(transactions) {
    const interaction = transactions.some(tx => tx.to.toLowerCase() === UNISWAP_V2_ROUTER.toLowerCase());
    return { met: interaction };
}


async function main() {
    console.log(`🚀 Checking Airdrop Eligibility for wallet: ${WALLET_ADDRESS}\n`);
    
    try {
        const transactions = await getTxHistory(WALLET_ADDRESS);
        
        // Run checks in parallel
        const [ageResult, countResult, defiResult] = await Promise.all([
            checkWalletAge(transactions),
            checkTxCount(WALLET_ADDRESS),
            checkDeFiInteraction(transactions)
        ]);
        
        // Print report
        console.log("--- Airdrop Eligibility Report ---");
        console.log(`${ageResult.met ? '✅' : '❌'} Wallet Age > ${MIN_WALLET_AGE_DAYS} days (Actual: ${ageResult.age} days)`);
        console.log(`${countResult.met ? '✅' : '❌'} Transaction Count > ${MIN_TX_COUNT} (Actual: ${countResult.count} txs)`);
        console.log(`${defiResult.met ? '✅' : '❌'} Interacted with Uniswap V2 Router`);
        console.log("---------------------------------");
        
    } catch (error) {
        console.error("❌ An error occurred:", error.message);
    }
}

main();
