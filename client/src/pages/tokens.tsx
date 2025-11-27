import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RiskScore, RiskBadge } from "@/components/risk-score";
import { apiRequest } from "@/lib/queryClient";
import type { TokenAnalysis } from "@shared/schema";
import { 
  Coins, 
  Search, 
  Shield, 
  AlertTriangle, 
  Check, 
  X,
  ExternalLink,
  Copy,
  Lock,
  Unlock,
  Droplets,
  Users,
  ArrowDown,
  ArrowUp,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function TokenChecker() {
  const [address, setAddress] = useState("");
  const [chain, setChain] = useState("polygon");
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (data: { address: string; chain: string }) => {
      const response = await apiRequest("POST", "/api/analyze-token", data);
      return response as TokenAnalysis;
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Unable to analyze the token. Please verify the address.",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    
    if (!/^0x[a-fA-F0-9]{40}$/.test(address.trim())) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid token contract address.",
        variant: "destructive",
      });
      return;
    }
    
    analyzeMutation.mutate({ address: address.trim(), chain });
  };

  const copyAddress = () => {
    if (result?.address) {
      navigator.clipboard.writeText(result.address);
      toast({
        title: "Copied",
        description: "Token address copied to clipboard",
      });
    }
  };

  const result = analyzeMutation.data;

  // Explorer URLs removed - can be added back later if needed

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Token Safety Checker</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Analyze tokens for liquidity locks, ownership, taxes, and rug pull risks
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Coins className="w-4 h-4" />
            Check Token
          </CardTitle>
          <CardDescription>
            Enter a token address to perform a comprehensive safety analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="0x..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="pl-10 font-mono text-sm"
                data-testid="input-token-address"
              />
            </div>
            <Select value={chain} onValueChange={setChain}>
              <SelectTrigger className="w-full sm:w-40" data-testid="select-chain">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="polygon">Polygon</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              type="submit" 
              disabled={analyzeMutation.isPending || !address.trim()}
              className="gap-2"
              data-testid="button-check"
            >
              {analyzeMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Check
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {analyzeMutation.isPending && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="w-20 h-20 rounded-full" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {result && !analyzeMutation.isPending && (
        <div className="space-y-4">
          <Card className={cn(
            "border-2",
            result.riskLevel === "danger" && "border-danger/50",
            result.riskLevel === "warning" && "border-warning/50",
            result.riskLevel === "safe" && "border-success/50"
          )}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <RiskScore score={result.riskScore} size="lg" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        {result.name}
                        <Badge variant="outline" className="font-mono">{result.symbol}</Badge>
                        <RiskBadge level={result.riskLevel} />
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-sm text-muted-foreground font-mono truncate max-w-[300px]">
                          {result.address}
                        </p>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyAddress}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{result.chain}</Badge>
                      {/* Explorer link removed */}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium">Safety Summary</h4>
                    <p className="text-sm text-muted-foreground">
                      {result.riskLevel === "safe" && "This token appears to be safe. Liquidity is locked, ownership is renounced, and no concerning patterns were detected."}
                      {result.riskLevel === "warning" && "This token has some potential risks. Review the detected issues carefully before investing."}
                      {result.riskLevel === "danger" && "This token has been flagged as high-risk. It may be a honeypot, scam, or have other malicious characteristics."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Droplets className="w-4 h-4" />
                  Liquidity Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={cn(
                  "p-4 rounded-lg",
                  result.liquidityLocked ? "bg-success/5" : "bg-danger/5"
                )}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {result.liquidityLocked ? (
                        <Lock className="w-4 h-4 text-success" />
                      ) : (
                        <Unlock className="w-4 h-4 text-danger" />
                      )}
                      <span className="font-medium text-sm">Liquidity Status</span>
                    </div>
                    <Badge variant={result.liquidityLocked ? "outline" : "destructive"} className={result.liquidityLocked ? "bg-success/10 text-success border-success/20" : ""}>
                      {result.liquidityLocked ? "Locked" : "Unlocked"}
                    </Badge>
                  </div>
                  {result.liquidityAmount && (
                    <p className="text-sm text-muted-foreground">
                      Amount: {result.liquidityAmount}
                    </p>
                  )}
                  {result.lockDuration && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Clock className="w-3 h-3" />
                      Lock Duration: {result.lockDuration}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Top Holders Concentration</span>
                    </div>
                    <span className={cn(
                      "text-sm font-medium",
                      result.topHoldersConcentration > 50 ? "text-danger" : 
                      result.topHoldersConcentration > 30 ? "text-warning" : "text-success"
                    )}>
                      {result.topHoldersConcentration}%
                    </span>
                  </div>
                  <Progress 
                    value={result.topHoldersConcentration} 
                    className={cn(
                      "h-2",
                      result.topHoldersConcentration > 50 ? "[&>div]:bg-danger" : 
                      result.topHoldersConcentration > 30 ? "[&>div]:bg-warning" : "[&>div]:bg-success"
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ArrowDown className="w-4 h-4" />
                  Buy/Sell Taxes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className={cn(
                    "p-4 rounded-lg text-center",
                    result.buyTax > 10 ? "bg-danger/5" : 
                    result.buyTax > 5 ? "bg-warning/5" : "bg-success/5"
                  )}>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <ArrowDown className={cn(
                        "w-4 h-4",
                        result.buyTax > 10 ? "text-danger" : 
                        result.buyTax > 5 ? "text-warning" : "text-success"
                      )} />
                      <span className="text-sm text-muted-foreground">Buy Tax</span>
                    </div>
                    <span className={cn(
                      "text-2xl font-bold",
                      result.buyTax > 10 ? "text-danger" : 
                      result.buyTax > 5 ? "text-warning" : "text-success"
                    )}>
                      {result.buyTax}%
                    </span>
                  </div>
                  <div className={cn(
                    "p-4 rounded-lg text-center",
                    result.sellTax > 10 ? "bg-danger/5" : 
                    result.sellTax > 5 ? "bg-warning/5" : "bg-success/5"
                  )}>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <ArrowUp className={cn(
                        "w-4 h-4",
                        result.sellTax > 10 ? "text-danger" : 
                        result.sellTax > 5 ? "text-warning" : "text-success"
                      )} />
                      <span className="text-sm text-muted-foreground">Sell Tax</span>
                    </div>
                    <span className={cn(
                      "text-2xl font-bold",
                      result.sellTax > 10 ? "text-danger" : 
                      result.sellTax > 5 ? "text-warning" : "text-success"
                    )}>
                      {result.sellTax}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security Checks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <TokenCheck 
                  label="Honeypot" 
                  passed={!result.isHoneypot} 
                  positiveText="Not a honeypot"
                  negativeText="Honeypot detected"
                />
                <TokenCheck 
                  label="Ownership" 
                  passed={result.ownershipRenounced} 
                  positiveText="Ownership renounced"
                  negativeText="Owner can modify"
                />
                <TokenCheck 
                  label="Mint Function" 
                  passed={!result.canMint} 
                  positiveText="Cannot mint new tokens"
                  negativeText="Can mint tokens"
                />
                <TokenCheck 
                  label="Pause Function" 
                  passed={!result.canPause} 
                  positiveText="Cannot pause trading"
                  negativeText="Can pause trading"
                />
                <TokenCheck 
                  label="Blacklist" 
                  passed={!result.canBlacklist} 
                  positiveText="No blacklist function"
                  negativeText="Can blacklist wallets"
                />
                <TokenCheck 
                  label="Max Tx Limit" 
                  passed={!result.maxTxLimit} 
                  positiveText="No transaction limit"
                  negativeText="Has transaction limit"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!result && !analyzeMutation.isPending && (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Coins className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="font-semibold mb-1">Enter a token address</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Our AI will analyze the token for liquidity locks, ownership status, 
                buy/sell taxes, honeypot risks, and other safety concerns.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface TokenCheckProps {
  label: string;
  passed: boolean;
  positiveText: string;
  negativeText: string;
}

function TokenCheck({ label, passed, positiveText, negativeText }: TokenCheckProps) {
  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-lg",
      passed ? "bg-success/5" : "bg-danger/5"
    )}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        passed ? "bg-success/10" : "bg-danger/10"
      )}>
        {passed ? (
          <CheckCircle2 className="w-4 h-4 text-success" />
        ) : (
          <XCircle className="w-4 h-4 text-danger" />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground truncate">
          {passed ? positiveText : negativeText}
        </p>
      </div>
    </div>
  );
}
