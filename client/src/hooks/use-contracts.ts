import { useWallet } from "@/components/wallet-connection";
import { ethers } from "ethers";
import { 
  getContract, 
  getContractAddress,
  RISK_REGISTRY_ABI,
  SAFETY_NFT_ABI,
  SCANNER_ACCESS_ABI
} from "@/lib/contracts";
import { useMemo } from "react";

export function useContracts() {
  const { isConnected, address, chainId } = useWallet();

  const contracts = useMemo(() => {
    if (!isConnected || !window.ethereum || chainId !== 80002) {
      return null;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      return {
        provider,
        riskRegistry: getContract(
          getContractAddress("RiskRegistry"),
          RISK_REGISTRY_ABI,
          provider
        ),
        safetyNFT: getContract(
          getContractAddress("SafetyNFT"),
          SAFETY_NFT_ABI,
          provider
        ),
        scannerAccess: getContract(
          getContractAddress("ScannerAccess"),
          SCANNER_ACCESS_ABI,
          provider
        ),
      };
    } catch (error) {
      console.error("Error initializing contracts:", error);
      return null;
    }
  }, [isConnected, chainId]);

  const getSigner = async () => {
    if (!window.ethereum) return null;
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider.getSigner();
  };

  return {
    contracts,
    getSigner,
    isReady: contracts !== null && isConnected && chainId === 80002,
  };
}

