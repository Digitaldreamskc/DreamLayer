const hre = require("hardhat");

async function main() {
  console.log("Deploying DreamLayer NFT contract...");

  const DreamLayerNFT = await hre.ethers.getContractFactory("DreamLayerNFT");
  const dreamLayerNFT = await DreamLayerNFT.deploy();

  await dreamLayerNFT.deployed();

  console.log("DreamLayerNFT deployed to:", dreamLayerNFT.address);

  // Store the contract addresses for future reference
  const fs = require("fs");
  const contractAddresses = {
    DreamLayerNFT: dreamLayerNFT.address
  };

  fs.writeFileSync(
    "contract-addresses.json",
    JSON.stringify(contractAddresses, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });