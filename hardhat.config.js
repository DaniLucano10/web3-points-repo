require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.30",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY || ""], // Ensure this is set in your .env file
    },
  },
};
