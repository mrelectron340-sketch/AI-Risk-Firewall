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

  const mockStats: DailyReport = stats || {
    id: "1",
    walletAddress: address || "",
    date: new Date().toISOString(),
    threatsBlocked: 12,
    contractsFlagged: 3,
    tokensAnalyzed: 28,
    transactionsScanned: 156,
    riskySitesBlocked: 7,
    overallSafetyScore: 94,
  };

  const mockActivities: ProtectionLog[] = activities || [
    {
      id: "1",
      walletAddress: address || "",
      actionType: "website_blocked",
      targetUrl: "claim-airdrop2025.com",
      riskScore: 15,
      riskLevel: "danger",
      description: "Phishing website blocked - fake airdrop claim",
      timestamp: new Date(Date.now() - 300000).toISOString(),
    },
    {
      id: "2",
      walletAddress: address || "",
      actionType: "contract_flagged",
      targetAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bd3e",
      riskScore: 32,
      riskLevel: "danger",
      description: "Honeypot contract detected - sell function disabled",
      timestamp: new Date(Date.now() - 900000).toISOString(),
    },
    {
      id: "3",
      walletAddress: address || "",
      actionType: "token_warning",
      targetAddress: "0x1234567890abcdef1234567890abcdef12345678",
      riskScore: 55,
      riskLevel: "warning",
      description: "High sell tax detected (15%)",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: "4",
      walletAddress: address || "",
      actionType: "transaction_blocked",
      targetAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
      riskScore: 22,
      riskLevel: "danger",
      description: "Wallet linked to known drainer - transaction blocked",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
  ];

  const mockTrustNFT: TrustNFT = trustNFT || {
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
              value={mockStats.threatsBlocked}
              subtitle="Today"
              icon={ShieldBan}
              variant="danger"
              trend={{ value: 23, isPositive: false }}
            />
            <StatsCard
              title="Contracts Flagged"
              value={mockStats.contractsFlagged}
              subtitle="This week"
              icon={FileCode}
              variant="warning"
            />
            <StatsCard
              title="Tokens Analyzed"
              value={mockStats.tokensAnalyzed}
              subtitle="This month"
              icon={Coins}
              variant="default"
            />
            <StatsCard
              title="Safety Score"
              value={`${mockStats.overallSafetyScore}%`}
              subtitle="Overall protection"
              icon={TrendingUp}
              variant="success"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ActivityFeed 
            activities={mockActivities} 
            maxItems={6}
          />

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
          <TrustNFTDisplay nft={mockTrustNFT} />

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Today's Protection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-4">
                <RiskScore score={mockStats.overallSafetyScore} size="lg" />
              </div>
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Websites Scanned</span>
                  <span className="font-medium">{mockStats.riskySitesBlocked + 24}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Risky Sites Blocked</span>
                  <span className="font-medium text-danger">{mockStats.riskySitesBlocked}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Transactions Scanned</span>
                  <span className="font-medium">{mockStats.transactionsScanned}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
