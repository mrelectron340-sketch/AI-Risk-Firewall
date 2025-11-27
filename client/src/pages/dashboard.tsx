import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCard } from "@/components/stats-card";
import { ActivityFeed } from "@/components/activity-feed";
import { TrustNFTDisplay } from "@/components/trust-nft-display";
import { RiskScore } from "@/components/risk-score";
import { useWallet } from "@/components/wallet-connection";
import type { ProtectionLog, TrustNFT, DailyReport } from "@shared/schema";
import { 
  Shield, 
  ShieldBan, 
  FileCode, 
  Coins, 
  TrendingUp,
  Globe,
  ArrowRight,
  Zap,
  Activity,
  RefreshCw
} from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { isConnected, address } = useWallet();

  const { data: stats, isLoading: statsLoading } = useQuery<DailyReport>({
    queryKey: ["/api/stats", address],
    enabled: isConnected,
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery<ProtectionLog[]>({
    queryKey: ["/api/activities", address],
    enabled: isConnected,
  });

  const { data: trustNFT, isLoading: nftLoading } = useQuery<TrustNFT>({
    queryKey: ["/api/trust-nft", address],
    enabled: isConnected,
  });

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Shield className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Welcome to AI Risk Firewall</h1>
        <p className="text-muted-foreground max-w-md mb-6">
          Connect your wallet to activate protection and view your security dashboard.
          Your crypto assets deserve the best defense.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild variant="outline">
            <Link href="/scanner">
              <Globe className="w-4 h-4 mr-2" />
              Try Website Scanner
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contracts">
              <FileCode className="w-4 h-4 mr-2" />
              Analyze Contract
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Use real data from API, show empty state if no data
  const displayStats: DailyReport = stats || {
    id: "1",
    walletAddress: address || "",
    date: new Date().toISOString(),
    threatsBlocked: 0,
    contractsFlagged: 0,
    tokensAnalyzed: 0,
    transactionsScanned: 0,
    riskySitesBlocked: 0,
    overallSafetyScore: 100, // Start at 100 for new users
  };

  const displayActivities: ProtectionLog[] = activities || [];

  const displayTrustNFT: TrustNFT = trustNFT || {
    id: "1",
    walletAddress: address || "",
    tokenId: null,
    trustScore: 100, // Start at 100 for new users
    scamsAvoided: 0,
    safeTransactions: 0,
    rank: "N/A",
    tier: "bronze",
    lastUpdated: new Date().toISOString(),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Security Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Real-time protection status and activity
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" data-testid="button-refresh-stats">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <StatsCard
              title="Threats Blocked"
              value={displayStats.threatsBlocked}
              subtitle="Today"
              icon={ShieldBan}
              variant="danger"
            />
            <StatsCard
              title="Contracts Flagged"
              value={displayStats.contractsFlagged}
              subtitle="This week"
              icon={FileCode}
              variant="warning"
            />
            <StatsCard
              title="Tokens Analyzed"
              value={displayStats.tokensAnalyzed}
              subtitle="This month"
              icon={Coins}
              variant="default"
            />
            <StatsCard
              title="Safety Score"
              value={`${displayStats.overallSafetyScore}%`}
              subtitle="Overall protection"
              icon={TrendingUp}
              variant="success"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {displayActivities.length > 0 ? (
            <ActivityFeed 
              activities={displayActivities} 
              maxItems={6}
            />
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="font-semibold mb-2">No Activity Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start scanning websites, contracts, and tokens to see your protection activity here.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" asChild size="sm">
                    <Link href="/scanner">Scan Website</Link>
                  </Button>
                  <Button variant="outline" asChild size="sm">
                    <Link href="/contracts">Analyze Contract</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button asChild variant="outline" className="justify-start gap-2 h-auto py-3">
                  <Link href="/scanner">
                    <Globe className="w-4 h-4 text-primary" />
                    <div className="text-left">
                      <div className="font-medium text-sm">Scan Website</div>
                      <div className="text-xs text-muted-foreground">Check URL safety</div>
                    </div>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start gap-2 h-auto py-3">
                  <Link href="/contracts">
                    <FileCode className="w-4 h-4 text-primary" />
                    <div className="text-left">
                      <div className="font-medium text-sm">Analyze Contract</div>
                      <div className="text-xs text-muted-foreground">Verify smart contract</div>
                    </div>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start gap-2 h-auto py-3">
                  <Link href="/tokens">
                    <Coins className="w-4 h-4 text-primary" />
                    <div className="text-left">
                      <div className="font-medium text-sm">Check Token</div>
                      <div className="text-xs text-muted-foreground">Token safety check</div>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <TrustNFTDisplay nft={displayTrustNFT} />

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Today's Protection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-4">
                <RiskScore score={displayStats.overallSafetyScore} size="lg" />
              </div>
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Websites Scanned</span>
                  <span className="font-medium">{displayStats.riskySitesBlocked + (displayStats.transactionsScanned || 0)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Risky Sites Blocked</span>
                  <span className="font-medium text-danger">{displayStats.riskySitesBlocked}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Transactions Scanned</span>
                  <span className="font-medium">{displayStats.transactionsScanned}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
