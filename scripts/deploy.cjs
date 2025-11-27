const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy RiskRegistry
  console.log("\n1. Deploying RiskRegistry...");
  const RiskRegistry = await ethers.getContractFactory("RiskRegistry");
  const riskRegistry = await RiskRegistry.deploy();
  await riskRegistry.waitForDeployment();
  const riskRegistryAddress = await riskRegistry.getAddress();
  console.log("RiskRegistry deployed to:", riskRegistryAddress);

  // Deploy SafetyNFT
  console.log("\n2. Deploying SafetyNFT...");
  const SafetyNFT = await ethers.getContractFactory("SafetyNFT");
  const safetyNFT = await SafetyNFT.deploy(deployer.address);
  await safetyNFT.waitForDeployment();
  const safetyNFTAddress = await safetyNFT.getAddress();
  console.log("SafetyNFT deployed to:", safetyNFTAddress);

  // Set RiskRegistry in SafetyNFT
  console.log("\n3. Linking contracts...");
  await safetyNFT.setRiskRegistry(riskRegistryAddress);
  console.log("SafetyNFT linked to RiskRegistry");

  // Deploy ScannerAccess
  console.log("\n4. Deploying ScannerAccess...");
  const ScannerAccess = await ethers.getContractFactory("ScannerAccess");
  const scannerAccess = await ScannerAccess.deploy(deployer.address);
  await scannerAccess.waitForDeployment();
  const scannerAccessAddress = await scannerAccess.getAddress();
  console.log("ScannerAccess deployed to:", scannerAccessAddress);

  // Summary
  console.log("\n=== Deployment Summary ===");
  console.log("Network: Polygon Amoy Testnet");
  console.log("Deployer:", deployer.address);
  console.log("\nContract Addresses:");
  console.log("RiskRegistry:", riskRegistryAddress);
  console.log("SafetyNFT:", safetyNFTAddress);
  console.log("ScannerAccess:", scannerAccessAddress);
  
  // Save addresses to a file
  const addresses = {
    network: "polygonAmoy",
    deployer: deployer.address,
    contracts: {
      RiskRegistry: riskRegistryAddress,
      SafetyNFT: safetyNFTAddress,
      ScannerAccess: scannerAccessAddress,
    },
    timestamp: new Date().toISOString(),
  };
  
  fs.writeFileSync(
    "./deployment-addresses.json",
    JSON.stringify(addresses, null, 2)
  );
  console.log("\nAddresses saved to deployment-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

