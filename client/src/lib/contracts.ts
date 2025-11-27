import { ethers } from "ethers";

// Contract ABIs (simplified - you'll need full ABIs after deployment)
export const RISK_REGISTRY_ABI = [
  "function reportRisk(address _contractAddress, uint8 _riskScore, string memory _threatType) external",
  "function getRiskLogs(address _contractAddress) external view returns (tuple(address reporter, address contractAddress, uint8 riskScore, uint256 timestamp, string threatType, bool verified)[])",
  "function getRiskStats(address _contractAddress) external view returns (tuple(uint256 totalReports, uint256 verifiedReports, uint8 averageRiskScore))",
  "function isVerifiedScam(address _contractAddress) external view returns (bool)",
  "event RiskReported(address indexed reporter, address indexed contractAddress, uint8 riskScore, string threatType, uint256 timestamp)",
];

export const SAFETY_NFT_ABI = [
  "function mintSafetyNFT(address _wallet) external returns (uint256)",
  "function getSafetyProfile(address _wallet) external view returns (tuple(uint8 trustScore, uint256 scamsAvoided, uint256 safeTransactions, uint256 lastUpdated, string tier))",
  "function hasSafetyNFT(address _wallet) external view returns (bool)",
  "function walletToTokenId(address) external view returns (uint256)",
  "event SafetyProfileUpdated(address indexed wallet, uint256 indexed tokenId, uint8 trustScore, uint256 scamsAvoided)",
];

export const SCANNER_ACCESS_ABI = [
  "function canScan(address _user) external view returns (bool)",
  "function useScan(address _user) external returns (bool)",
  "function subscribePremium() external payable",
  "function payPerScan() external payable",
  "function getUserSubscription(address _user) external view returns (tuple(uint256 freeScansRemaining, uint256 premiumScansRemaining, uint256 subscriptionEndTime, bool isPremium, uint256 totalScansUsed))",
  "function pricing() external view returns (tuple(uint256 freeScansPerMonth, uint256 premiumPricePerMonth, uint256 payPerScanPrice))",
  "event SubscriptionUpdated(address indexed user, bool isPremium, uint256 freeScansRemaining)",
  "event ScanUsed(address indexed user, bool isPremium, uint256 scansRemaining)",
];

// Contract addresses (will be updated after deployment)
export const CONTRACT_ADDRESSES = {
  polygonAmoy: {
    RiskRegistry: process.env.VITE_RISK_REGISTRY_ADDRESS || "",
    SafetyNFT: process.env.VITE_SAFETY_NFT_ADDRESS || "",
    ScannerAccess: process.env.VITE_SCANNER_ACCESS_ADDRESS || "",
  },
};

// Polygon Amoy chain config
export const POLYGON_AMOY_CHAIN = {
  id: 80002,
  name: "Polygon Amoy",
  network: "polygon-amoy",
  nativeCurrency: {
    decimals: 18,
    name: "MATIC",
    symbol: "MATIC",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-amoy.polygon.technology"],
    },
    public: {
      http: ["https://rpc-amoy.polygon.technology"],
    },
  },
  blockExplorers: {
    default: {
      name: "Polygonscan Amoy",
      url: "https://amoy.polygonscan.com",
    },
  },
  testnet: true,
};

export function getContract(
  address: string,
  abi: any[],
  signerOrProvider: ethers.Signer | ethers.Provider
) {
  return new ethers.Contract(address, abi, signerOrProvider);
}

