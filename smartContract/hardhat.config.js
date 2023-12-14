require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
// https://mumbai.polygonscan.com/address/0xDCe274f7DCAd7103C6564D487CD19Bd2A8A12059
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks: {
    polygon_mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [
        process.env.PRIVATE_KEY,
      ],
    },
  },

  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGON_API,
    },
  },
  sourcify: {
    enabled: true
  }
};
