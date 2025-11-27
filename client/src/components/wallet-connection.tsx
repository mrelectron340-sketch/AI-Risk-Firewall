import { useState, useEffect, createContext, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wallet, LogOut, Copy, ExternalLink, Check, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  formatAddress: (addr: string) => string;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const connect = async () => {
    if (typeof window.ethereum === "undefined") {
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts && accounts[0]) {
        setAddress(accounts[0]);
      }
      const chainIdHex = await window.ethereum.request({
        method: "eth_chainId",
      });
      setChainId(parseInt(chainIdHex, 16));
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setChainId(null);
  };

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts[0]) {
          setAddress(accounts[0]);
        } else {
          setAddress(null);
        }
      });

      window.ethereum.on("chainChanged", (chainIdHex: string) => {
        setChainId(parseInt(chainIdHex, 16));
      });

      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts[0]) {
            setAddress(accounts[0]);
            window.ethereum
              .request({ method: "eth_chainId" })
              .then((chainIdHex: string) => {
                setChainId(parseInt(chainIdHex, 16));
              });
          }
        });
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        isConnecting,
        chainId,
        connect,
        disconnect,
        formatAddress,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

interface WalletButtonProps {
  className?: string;
}

export function WalletButton({ className }: WalletButtonProps) {
  const { address, isConnected, isConnecting, chainId, connect, disconnect, formatAddress } = useWallet();
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getChainName = (id: number | null) => {
    switch (id) {
      case 1:
        return "Ethereum";
      case 137:
        return "Polygon";
      case 80001:
        return "Mumbai";
      case 80002:
        return "Amoy";
      default:
        return "Unknown";
    }
  };

  const isPolygon = chainId === 137 || chainId === 80001 || chainId === 80002;

  if (!isConnected) {
    return (
      <Button
        onClick={connect}
        disabled={isConnecting}
        className={cn("gap-2", className)}
        data-testid="button-connect-wallet"
      >
        <Wallet className="w-4 h-4" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn("gap-2", className)} data-testid="button-wallet-menu">
          <div className={cn("w-2 h-2 rounded-full", isPolygon ? "bg-success" : "bg-warning")} />
          <span className="font-mono text-sm">{formatAddress(address!)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Connected Wallet</span>
          <Badge variant="outline" className="text-xs">
            {getChainName(chainId)}
          </Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyAddress} className="gap-2 cursor-pointer" data-testid="button-copy-address">
          {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
          <span className="font-mono text-xs">{formatAddress(address!)}</span>
        </DropdownMenuItem>
        {/* Explorer link removed - can be added back later */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnect} className="gap-2 cursor-pointer text-danger" data-testid="button-disconnect-wallet">
          <LogOut className="w-4 h-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface NetworkStatusProps {
  className?: string;
}

export function NetworkStatus({ className }: NetworkStatusProps) {
  const { chainId, isConnected } = useWallet();
  
  if (!isConnected) return null;

  const isPolygon = chainId === 137 || chainId === 80001 || chainId === 80002;
  const networkName = chainId === 137 ? "Polygon Mainnet" : chainId === 80001 ? "Mumbai Testnet" : chainId === 80002 ? "Amoy Testnet" : "Wrong Network";

  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      <div className={cn(
        "w-2 h-2 rounded-full animate-pulse",
        isPolygon ? "bg-success" : "bg-warning"
      )} />
      <span className={cn(
        "font-medium",
        isPolygon ? "text-success" : "text-warning"
      )}>
        {networkName}
      </span>
    </div>
  );
}
