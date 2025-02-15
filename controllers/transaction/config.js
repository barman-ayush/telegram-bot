// src/config.js
const dotenv = require('dotenv');
const { ethers } = require('ethers');

dotenv.config();

function validateEnvVar(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} is not set`);
    }
    return value;
}

const config = {
    rpcUrl: validateEnvVar('ETH_RPC_URL'),
    recipientAddress: validateEnvVar('RECIPIENT_ADDRESS'),
    expectedAmount: validateEnvVar('EXPECTED_AMOUNT'),
    maxBlocksToWait: parseInt(validateEnvVar('MAX_BLOCKS_TO_WAIT')),
    confirmations: 1, // Number of confirmations to wait for
};

// Validate Ethereum address format
if (!ethers.isAddress(config.recipientAddress)) {
    throw new Error('Invalid recipient address format');
}

module.exports = { config };