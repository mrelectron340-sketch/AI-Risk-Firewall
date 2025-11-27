import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { TrustNFT } from "@shared/schema";
import { 
  Shield, 
  Award, 
  TrendingUp, 
  Sparkles,
  Trophy,
  Star,
  Crown,
  Gem
} from "lucide-react";

interface TrustNFTDisplayProps {
  nft: TrustNFT | null;
  className?: string;
  compact?: boolean;
}

export function TrustNFTDisplay({ nft, className, compact = false }: TrustNFTDisplayProps) {
  const getTierConfig = (tier: TrustNFT["tier"]) => {
    switch (tier) {
      case "bronze":
        return {
          gradient: "from-amber-600 to-amber-800",
          bgGradient: "from-amber-500/20 to-amber-700/10",
          icon: Star,
          label: "Bronze",
          color: "text-amber-600",
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
          minScore: 91,
          maxScore: 100,
        };
    }
  };

  if (!nft) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Trust NFT
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
              <Shield className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground">No Trust NFT yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Connect wallet to view or mint
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const tierConfig = getTierConfig(nft.tier);
  const TierIcon = tierConfig.icon;

  if (compact) {
    return (
      <div className={cn("flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r", tierConfig.bgGradient, className)}>
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br", tierConfig.gradient)}>
          <TierIcon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{nft.trustScore}</span>
            <Badge variant="outline" className={cn("text-xs", tierConfig.color)}>
              {tierConfig.label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {nft.scamsAvoided} threats blocked
          </p>
        </div>
      </div>
    );
  }

  const progressToNextTier = nft.trustScore >= 100 
    ? 100 
    : ((nft.trustScore - tierConfig.minScore) / (tierConfig.maxScore - tierConfig.minScore)) * 100;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className={cn("h-2 bg-gradient-to-r", tierConfig.gradient)} />
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Trophy className="w-4 h-4" />
          Trust NFT
          <Badge variant="outline" className={cn("ml-auto text-xs", tierConfig.color)}>
            {tierConfig.label} Tier
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-20 h-20 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg",
            tierConfig.gradient
          )}>
            <TierIcon className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">{nft.trustScore}</span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Trust Score
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress to next tier</span>
            <span className="font-medium">{Math.round(progressToNextTier)}%</span>
          </div>
          <Progress value={progressToNextTier} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">Scams Avoided</span>
            </div>
            <span className="text-xl font-bold">{nft.scamsAvoided}</span>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Safe Tx</span>
            </div>
            <span className="text-xl font-bold">{nft.safeTransactions}</span>
          </div>
        </div>

        {nft.rank && (
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-sm text-muted-foreground">Global Rank</span>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-warning" />
              <span className="font-semibold">{nft.rank}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
