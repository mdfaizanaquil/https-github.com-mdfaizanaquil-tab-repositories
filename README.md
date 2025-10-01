# Airdrop Eligibility Checker

An advanced Node.js script that checks a wallet address against a pre-defined set of airdrop criteria. This project serves as a template for building more complex on-chain analysis tools.

## Hypothetical Criteria Checked

1.  **Wallet Age:** Is the wallet older than 90 days?
2.  **Transaction Count:** Has the wallet made more than 10 transactions?
3.  **DeFi Interaction:** Has the wallet interacted with the Uniswap V2 Router contract?

## Setup

1.  **Clone & Install:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-name>
    npm install ethers dotenv axios
    ```

2.  **Configure `.env` file:**
    * Create a file named `.env` and add the following:
        ```env
        RPC_URL="YOUR_ETHEREUM_MAINNET_RPC_URL"
        ETHERSCAN_API_KEY="YOUR_ETHERSCAN_API_KEY"
        WALLET_ADDRESS_TO_CHECK="0xYOUR_WALLET_ADDRESS_HERE"
        ```

3.  **Run the checker:**
    ```bash
    node checker.js
    ```
