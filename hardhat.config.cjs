require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    polygonAmoy: {
      url: process.env.POLYGON_AMOY_RPC_URL || "https://rpc-amoy.polygon.technology",
      accounts: (() => {
        if (!process.env.PRIVATE_KEY) {
          console.warn("⚠️  PRIVATE_KEY not found in .env file");
          return [];
        }
        let key = process.env.PRIVATE_KEY.trim();
        // Remove 0x prefix if present for validation
        const cleanKey = key.startsWith('0x') || key.startsWith('0X') ? key.slice(2) : key;
        
        // Validate length (should be 64 hex characters = 32 bytes)
        if (cleanKey.length !== 64) {
          throw new Error(
            `\n❌ Invalid PRIVATE_KEY length: ${cleanKey.length} characters\n` +
            `   Expected: 64 hex characters (32 bytes)\n` +
            `   Your key: ${cleanKey.length} characters\n` +
            `   \n` +
            `   📝 How to fix:\n` +
            `   1. Check your .env file\n` +
            `   2. PRIVATE_KEY should be exactly 64 hex characters\n` +
            `   3. It can have '0x' prefix or not\n` +
            `   4. Example: PRIVATE_KEY=0x1234...abcdef (64 chars after 0x)\n` +
            `   5. Make sure there are no extra spaces or quotes!\n` +
            `   \n` +
            `   Run 'npm run check-env' to validate your .env file\n`
          );
        }
        
        // Validate hex format
        if (!/^[0-9a-fA-F]+$/.test(cleanKey)) {
          throw new Error(
            `\n❌ Invalid PRIVATE_KEY format\n` +
            `   Must contain only hexadecimal characters (0-9, a-f, A-F)\n` +
            `   Check your .env file for any invalid characters.\n`
          );
        }
        
        // Return with 0x prefix
        return [`0x${cleanKey}`];
      })(),
      chainId: 80002,
    },
  },
  etherscan: {
    apiKey: {
      polygonAmoy: process.env.POLYGONSCAN_API_KEY || "",
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
