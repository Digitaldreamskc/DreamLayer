require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@typechain/hardhat");

const config = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 31337
    },
  },
  typechain: {
    outDir: "src/types/contracts",
    target: "ethers-v5",
  },
};

module.exports = config;