import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RiskScore, RiskBadge } from "@/components/risk-score";
import { apiRequest } from "@/lib/queryClient";
import type { ContractAnalysis } from "@shared/schema";
import { 
  FileCode, 
  Search, 
  Shield, 
  AlertTriangle, 
  Check, 
  X,
  ExternalLink,
  Copy,
  Lock,
  Unlock,
  Pause,
  Ban,
  Coins,
  Loader2,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function ContractAnalyzer() {
  const [address, setAddress] = useState("");
  const [chain, setChain] = useState("polygon");
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (data: { address: string; chain: string }) => {
      const response = await apiRequest("POST", "/api/analyze-contract", data);
      return response as ContractAnalysis;
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Unable to analyze the contract. Please verify the address.",
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
        description: "Please enter a valid Ethereum/Polygon contract address.",
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
        description: "Contract address copied to clipboard",
      });
    }
  };

  const result = analyzeMutation.data;

  // Explorer URLs removed - can be added back later if needed

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Smart Contract Analyzer</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Analyze smart contracts for security risks, honeypots, and rug pull patterns
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileCode className="w-4 h-4" />
            Analyze Contract
          </CardTitle>
          <CardDescription>
            Enter a contract address to perform a comprehensive security analysis
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
                data-testid="input-contract-address"
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
              data-testid="button-analyze"
            >
              {analyzeMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Analyze
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
                        {result.name || "Unknown Contract"}
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
                      {result.isVerified && (
                        <Badge variant="secondary" className="gap-1 bg-success/10 text-success border-success/20">
                          <Check className="w-3 h-3" />
                          Verified
                        </Badge>
                      )}
                      {/* Explorer link removed */}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium">Analysis Summary</h4>
                    <p className="text-sm text-muted-foreground">
                      {result.riskLevel === "safe" && "This contract appears to be safe. No significant security issues were detected."}
                      {result.riskLevel === "warning" && "This contract has some potential risks. Review the detected issues before interacting."}
                      {result.riskLevel === "danger" && "This contract has been flagged as high-risk. It may be a honeypot or have malicious functions. We strongly recommend avoiding it."}
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
                  <Shield className="w-4 h-4" />
                  Contract Checks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ContractCheck 
                  label="Source Verified" 
                  passed={result.isVerified} 
                  icon={Check}
                />
                <ContractCheck 
                  label="No Proxy Pattern" 
                  passed={!result.hasProxyPattern} 
                  icon={Lock}
                />
                <ContractCheck 
                  label="No Owner Privileges" 
                  passed={!result.hasOwnerPrivileges} 
                  icon={Unlock}
                />
                <ContractCheck 
                  label="No Mint Function" 
                  passed={!result.hasMintFunction} 
                  icon={Coins}
                />
                <ContractCheck 
                  label="No Pause Function" 
                  passed={!result.hasPauseFunction} 
                  icon={Pause}
                />
                <ContractCheck 
                  label="No Blacklist Function" 
                  passed={!result.hasBlacklistFunction} 
                  icon={Ban}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <RiskIndicator 
                  label="Honeypot Risk" 
                  isRisk={result.honeypotRisk}
                  description={result.honeypotRisk ? "Unable to sell tokens" : "Selling appears possible"}
                />
                <RiskIndicator 
                  label="Rug Pull Risk" 
                  isRisk={result.rugPullRisk}
                  description={result.rugPullRisk ? "Owner can drain liquidity" : "No obvious drain functions"}
                />
              </CardContent>
            </Card>
          </div>

          {result.issues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  Detected Issues ({result.issues.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {result.issues.map((issue, index) => (
                    <div key={index} className="flex items-start gap-4 p-4">
                      <div className={cn(
                        "p-2 rounded-lg",
                        issue.severity === "critical" && "bg-danger/10",
                        issue.severity === "high" && "bg-danger/10",
                        issue.severity === "medium" && "bg-warning/10",
                        issue.severity === "low" && "bg-muted"
                      )}>
                        <AlertTriangle className={cn(
                          "w-4 h-4",
                          issue.severity === "critical" && "text-danger",
                          issue.severity === "high" && "text-danger",
                          issue.severity === "medium" && "text-warning",
                          issue.severity === "low" && "text-muted-foreground"
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm capitalize">
                            {issue.type.replace(/_/g, " ")}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs capitalize",
                              issue.severity === "critical" && "border-danger/50 text-danger",
                              issue.severity === "high" && "border-danger/50 text-danger",
                              issue.severity === "medium" && "border-warning/50 text-warning",
                              issue.severity === "low" && "border-muted-foreground/50"
                            )}
                          >
                            {issue.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {issue.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {!result && !analyzeMutation.isPending && (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <FileCode className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="font-semibold mb-1">Enter a contract address</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Our AI will analyze the smart contract for honeypot patterns, 
                rug pull risks, owner privileges, and other security concerns.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface ContractCheckProps {
  label: string;
  passed: boolean;
  icon: any;
}

function ContractCheck({ label, passed, icon: Icon }: ContractCheckProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm">{label}</span>
      </div>
      {passed ? (
        <CheckCircle2 className="w-4 h-4 text-success" />
      ) : (
        <XCircle className="w-4 h-4 text-danger" />
      )}
    </div>
  );
}

interface RiskIndicatorProps {
  label: string;
  isRisk: boolean;
  description: string;
}

function RiskIndicator({ label, isRisk, description }: RiskIndicatorProps) {
  return (
    <div className={cn(
      "p-3 rounded-lg",
      isRisk ? "bg-danger/5" : "bg-success/5"
    )}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium">{label}</span>
        {isRisk ? (
          <Badge variant="destructive" className="text-xs">High</Badge>
        ) : (
          <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">Low</Badge>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
