import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import { useWallet } from "@/components/wallet-connection";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Loader2,
  Zap,
  Shield
} from "lucide-react";
import { RiskScore } from "@/components/risk-score";
import { apiRequest } from "@/lib/queryClient";

interface SimulationResult {
  safe: boolean;
  riskScore: number;
  warnings: string[];
  analysis: string;
  estimatedGas?: string;
  tokenLoss?: string;
}

export default function TransactionSimulator() {
  const { isConnected, address } = useWallet();
  const { toast } = useToast();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [data, setData] = useState("");

  const simulateMutation = useMutation({
    mutationFn: async (txData: { from: string; to: string; data: string }) => {
      const response = await apiRequest("POST", "/api/simulate-transaction", txData);
      return response as SimulationResult;
    },
    onSuccess: () => {
      toast({
        title: "Simulation Complete",
        description: "Transaction analyzed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Simulation Failed",
        description: error.message || "Unable to simulate transaction",
        variant: "destructive",
      });
    },
  });

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from.trim() || !to.trim()) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(from.trim()) || !/^0x[a-fA-F0-9]{40}$/.test(to.trim())) {
      toast({
        title: "Invalid Address",
        description: "Please enter valid Ethereum/Polygon addresses",
        variant: "destructive",
      });
      return;
    }

    simulateMutation.mutate({
      from: from.trim(),
      to: to.trim(),
      data: data.trim() || "0x",
    });
  };

  const fillCurrentWallet = () => {
    if (address) {
      setFrom(address);
    }
  };

  const result = simulateMutation.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transaction Simulator</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Simulate transactions before executing to check for risks
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
            <CardDescription>Enter transaction parameters to simulate</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSimulate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="from">From Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="from"
                    placeholder="0x..."
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    disabled={simulateMutation.isPending}
                  />
                  {isConnected && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={fillCurrentWallet}
                    >
                      Use My Wallet
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="to">To Address (Contract)</Label>
                <Input
                  id="to"
                  placeholder="0x..."
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  disabled={simulateMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data">Transaction Data (Optional)</Label>
                <Textarea
                  id="data"
                  placeholder="0x..."
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  disabled={simulateMutation.isPending}
                  rows={4}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty for simple transfers
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={simulateMutation.isPending || !isConnected}
              >
                {simulateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Simulating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Simulate Transaction
                  </>
                )}
              </Button>

              {!isConnected && (
                <p className="text-sm text-muted-foreground text-center">
                  Connect your wallet to use the simulator
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Simulation Results</CardTitle>
            <CardDescription>
              {result ? "Analysis complete" : "Results will appear here"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {simulateMutation.isPending ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Analyzing transaction...</p>
              </div>
            ) : result ? (
              <div className="space-y-6">
                <div className="flex items-center justify-center">
                  <RiskScore score={result.riskScore} size="lg" />
                </div>

                <div className="flex items-center justify-center gap-4">
                  {result.safe ? (
                    <Badge variant="default" className="gap-2 px-4 py-2 text-base">
                      <CheckCircle2 className="w-4 h-4" />
                      Transaction Safe
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-2 px-4 py-2 text-base">
                      <XCircle className="w-4 h-4" />
                      Transaction Risky
                    </Badge>
                  )}
                </div>

                {result.analysis && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{result.analysis}</p>
                  </div>
                )}

                {result.warnings && result.warnings.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      Warnings
                    </h4>
                    <ul className="space-y-1">
                      {result.warnings.map((warning, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-warning">•</span>
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.estimatedGas && (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Estimated Gas:</span>
                    <span className="font-mono font-semibold">{result.estimatedGas}</span>
                  </div>
                )}

                {result.tokenLoss && (
                  <div className="flex items-center justify-between p-3 bg-danger/10 rounded-lg border border-danger/20">
                    <span className="text-sm text-danger">Potential Token Loss:</span>
                    <span className="font-mono font-semibold text-danger">{result.tokenLoss}</span>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    <span>
                      {result.safe
                        ? "This transaction appears safe to execute"
                        : "Review warnings before proceeding"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Zap className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  Enter transaction details and click "Simulate" to analyze
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                1
              </div>
              <h4 className="font-semibold">Enter Details</h4>
              <p className="text-sm text-muted-foreground">
                Provide the transaction parameters including from/to addresses and data
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                2
              </div>
              <h4 className="font-semibold">AI Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Our AI analyzes the transaction for potential risks and token loss
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                3
              </div>
              <h4 className="font-semibold">Get Results</h4>
              <p className="text-sm text-muted-foreground">
                Review the risk score and warnings before executing the transaction
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

