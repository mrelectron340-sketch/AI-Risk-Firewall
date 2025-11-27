import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useWallet } from "@/components/wallet-connection";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { TrustNFT, ProtectionLog } from "@shared/schema";
import { 
  Shield, 
  Award, 
  TrendingUp, 
  Trophy,
  Star,
  Crown,
  Gem,
  Sparkles,
  Wallet,
  CheckCircle,
  Loader2,
  ExternalLink,
  Share2,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function TrustNFTPage() {
  const { isConnected, address } = useWallet();
  const { toast } = useToast();

  const { data: nft, isLoading } = useQuery<TrustNFT>({
    queryKey: ["/api/trust-nft", address],
    enabled: isConnected,
  });

  const { data: history } = useQuery<ProtectionLog[]>({
    queryKey: ["/api/activities", address],
    enabled: isConnected,
  });

  const mintMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/mint-trust-nft", { walletAddress: address });
      return response as TrustNFT;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trust-nft", address] });
      toast({
        title: "Trust NFT Minted",
        description: "Your Trust NFT has been successfully minted on Polygon!",
      });
    },
    onError: (error) => {
      toast({
        title: "Mint Failed",
        description: error.message || "Unable to mint Trust NFT. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getTierConfig = (tier: TrustNFT["tier"]) => {
    switch (tier) {
      case "bronze":
        return {
          gradient: "from-amber-600 to-amber-800",
          bgGradient: "from-amber-500/20 to-amber-700/10",
          icon: Star,
          label: "Bronze",
          color: "text-amber-600",
          nextTier: "Silver",
          minScore: 0,
          maxScore: 30,
        };
      case "silver":
        return {
          gradient: "from-slate-300 to-slate-500",
          bgGradient: "from-slate-300/20 to-slate-500/10",
          icon: Shield,
          label: "Silver",
          color: "text-slate-400",
          nextTier: "Gold",
          minScore: 31,
          maxScore: 50,
        };
      case "gold":
        return {
          gradient: "from-yellow-400 to-yellow-600",
          bgGradient: "from-yellow-400/20 to-yellow-600/10",
          icon: Award,
          label: "Gold",
          color: "text-yellow-500",
          nextTier: "Platinum",
          minScore: 51,
          maxScore: 70,
        };
      case "platinum":
        return {
          gradient: "from-cyan-300 to-cyan-500",
          bgGradient: "from-cyan-300/20 to-cyan-500/10",
          icon: Crown,
          label: "Platinum",
          color: "text-cyan-400",
          nextTier: "Diamond",
          minScore: 71,
          maxScore: 90,
        };
      case "diamond":
        return {
          gradient: "from-purple-400 to-pink-500",
          bgGradient: "from-purple-400/20 to-pink-500/10",
          icon: Gem,
          label: "Diamond",
          color: "text-purple-400",
          nextTier: null,
          minScore: 91,
          maxScore: 100,
        };
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Trophy className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Trust NFT</h1>
        <p className="text-muted-foreground max-w-md mb-6">
          Connect your wallet to view or mint your Trust NFT - a dynamic badge 
          that represents your security reputation on Polygon.
        </p>
        <Button variant="outline" className="gap-2">
          <Wallet className="w-4 h-4" />
          Connect Wallet to Continue
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Trust NFT</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Your on-chain security reputation
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <Skeleton className="w-32 h-32 rounded-xl" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const mockNFT: TrustNFT = nft || {
    id: "1",
    walletAddress: address || "",
    tokenId: "1234",
    trustScore: 78,
    scamsAvoided: 12,
    safeTransactions: 156,
    rank: "#2,847",
    tier: "gold",
    lastUpdated: new Date().toISOString(),
  };

  const tierConfig = getTierConfig(mockNFT.tier);
  const TierIcon = tierConfig.icon;
  const progressToNextTier = mockNFT.trustScore >= 100 
    ? 100 
    : ((mockNFT.trustScore - tierConfig.minScore) / (tierConfig.maxScore - tierConfig.minScore)) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Trust NFT</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Your on-chain security reputation badge
          </p>
        </div>
        {mockNFT.tokenId && (
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4" />
              View on Chain
            </a>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <div className={cn("h-3 bg-gradient-to-r", tierConfig.gradient)} />
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className={cn(
                  "w-32 h-32 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-xl flex-shrink-0 mx-auto md:mx-0",
                  tierConfig.gradient
                )}>
                  <TierIcon className="w-16 h-16 text-white" />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <h2 className="text-3xl font-bold">{mockNFT.trustScore}</h2>
                    <span className="text-muted-foreground">/100</span>
                    <Badge variant="outline" className={cn("ml-2", tierConfig.color)}>
                      {tierConfig.label} Tier
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">
                    Your Trust Score represents your security-conscious behavior on the blockchain.
                    Keep avoiding scams and making safe transactions to increase your score.
                  </p>

                  {tierConfig.nextTier && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress to {tierConfig.nextTier}</span>
                        <span className="font-medium">{Math.round(progressToNextTier)}%</span>
                      </div>
                      <Progress value={progressToNextTier} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {tierConfig.maxScore - mockNFT.trustScore} more points needed
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-danger/10">
                    <Shield className="w-5 h-5 text-danger" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{mockNFT.scamsAvoided}</p>
                    <p className="text-xs text-muted-foreground">Scams Avoided</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-success/10">
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{mockNFT.safeTransactions}</p>
                    <p className="text-xs text-muted-foreground">Safe Transactions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-warning/10">
                    <Sparkles className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{mockNFT.rank}</p>
                    <p className="text-xs text-muted-foreground">Global Rank</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <History className="w-4 h-4" />
                Score History
              </CardTitle>
              <CardDescription>
                Recent actions that affected your Trust Score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: "Blocked phishing website", points: "+5", type: "positive" },
                  { action: "Safe swap on Uniswap", points: "+2", type: "positive" },
                  { action: "Avoided honeypot contract", points: "+8", type: "positive" },
                  { action: "Verified contract interaction", points: "+1", type: "positive" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        item.type === "positive" ? "bg-success/10" : "bg-danger/10"
                      )}>
                        {item.type === "positive" ? (
                          <TrendingUp className="w-4 h-4 text-success" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-danger rotate-180" />
                        )}
                      </div>
                      <span className="text-sm">{item.action}</span>
                    </div>
                    <span className={cn(
                      "font-medium text-sm",
                      item.type === "positive" ? "text-success" : "text-danger"
                    )}>
                      {item.points}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="w-4 h-4" />
                Tier Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {[
                  { tier: "Bronze", benefit: "Basic protection alerts", unlocked: true },
                  { tier: "Silver", benefit: "Priority scanning", unlocked: mockNFT.trustScore >= 31 },
                  { tier: "Gold", benefit: "Enhanced AI analysis", unlocked: mockNFT.trustScore >= 51 },
                  { tier: "Platinum", benefit: "Real-time threat intel", unlocked: mockNFT.trustScore >= 71 },
                  { tier: "Diamond", benefit: "Custom security rules", unlocked: mockNFT.trustScore >= 91 },
                ].map((item, index) => (
                  <div key={index} className={cn(
                    "flex items-center gap-3 p-3 rounded-lg",
                    item.unlocked ? "bg-success/5" : "bg-muted/50"
                  )}>
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center",
                      item.unlocked ? "bg-success/10" : "bg-muted"
                    )}>
                      {item.unlocked ? (
                        <CheckCircle className="w-3.5 h-3.5 text-success" />
                      ) : (
                        <span className="text-xs text-muted-foreground">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={cn(
                        "text-sm font-medium",
                        !item.unlocked && "text-muted-foreground"
                      )}>
                        {item.tier}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.benefit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share Your Badge
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Show off your Trust NFT to prove your security-conscious reputation.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Copy Link
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>

          {!mockNFT.tokenId && (
            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Trophy className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Mint Your Trust NFT</p>
                    <p className="text-xs text-muted-foreground">Get your on-chain badge</p>
                  </div>
                </div>
                <Button 
                  className="w-full gap-2"
                  onClick={() => mintMutation.mutate()}
                  disabled={mintMutation.isPending}
                  data-testid="button-mint-nft"
                >
                  {mintMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Minting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Mint on Polygon
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
