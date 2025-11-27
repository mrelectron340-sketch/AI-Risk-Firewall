import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallet } from "@/components/wallet-connection";
import { 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  AlertTriangle,
  Activity,
  BarChart3,
  PieChart
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AnalyticsPage() {
  const { isConnected, address } = useWallet();

  // Mock analytics data - replace with real API calls
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/analytics", address],
    enabled: isConnected,
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        totalScans: 156,
        threatsBlocked: 23,
        contractsAnalyzed: 89,
        tokensChecked: 67,
        safetyScore: 94,
        weeklyData: [
          { day: "Mon", scans: 12, threats: 2, contracts: 8 },
          { day: "Tue", scans: 18, threats: 3, contracts: 12 },
          { day: "Wed", scans: 15, threats: 1, contracts: 10 },
          { day: "Thu", scans: 22, threats: 4, contracts: 15 },
          { day: "Fri", scans: 28, threats: 5, contracts: 18 },
          { day: "Sat", scans: 35, threats: 6, contracts: 14 },
          { day: "Sun", scans: 26, threats: 2, contracts: 12 },
        ],
        threatTypes: [
          { name: "Phishing", value: 45, color: "#ef4444" },
          { name: "Honeypot", value: 25, color: "#f59e0b" },
          { name: "Rug Pull", value: 20, color: "#dc2626" },
          { name: "Malicious Script", value: 10, color: "#991b1b" },
        ],
        riskDistribution: [
          { level: "Safe", count: 120, color: "#22c55e" },
          { level: "Warning", count: 28, color: "#f59e0b" },
          { level: "Danger", count: 8, color: "#ef4444" },
        ],
      };
    },
  });

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <BarChart3 className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Analytics Dashboard</h2>
        <p className="text-muted-foreground max-w-md">
          Connect your wallet to view detailed analytics and insights about your security activity.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = analytics || {
    totalScans: 0,
    threatsBlocked: 0,
    contractsAnalyzed: 0,
    tokensChecked: 0,
    safetyScore: 0,
    weeklyData: [],
    threatTypes: [],
    riskDistribution: [],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Insights and statistics about your security activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Scans</p>
                <p className="text-2xl font-bold mt-1">{stats.totalScans}</p>
              </div>
              <Activity className="w-8 h-8 text-primary opacity-50" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-success">
              <TrendingUp className="w-3 h-3" />
              <span>+12% this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Threats Blocked</p>
                <p className="text-2xl font-bold mt-1">{stats.threatsBlocked}</p>
              </div>
              <Shield className="w-8 h-8 text-success opacity-50" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-danger">
              <TrendingDown className="w-3 h-3" />
              <span>-5% this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Contracts Analyzed</p>
                <p className="text-2xl font-bold mt-1">{stats.contractsAnalyzed}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-primary opacity-50" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-success">
              <TrendingUp className="w-3 h-3" />
              <span>+8% this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Safety Score</p>
                <p className="text-2xl font-bold mt-1">{stats.safetyScore}%</p>
              </div>
              <Shield className="w-8 h-8 text-success opacity-50" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-success">
              <TrendingUp className="w-3 h-3" />
              <span>+2% this week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Scans, threats, and contracts analyzed</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="scans" stroke="#3b82f6" name="Scans" />
                <Line type="monotone" dataKey="threats" stroke="#ef4444" name="Threats" />
                <Line type="monotone" dataKey="contracts" stroke="#22c55e" name="Contracts" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Threat Types Distribution</CardTitle>
            <CardDescription>Breakdown of detected threats</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Tooltip />
                <Legend />
                <RechartsPieChart
                  data={stats.threatTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.threatTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RechartsPieChart>
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Level Distribution</CardTitle>
            <CardDescription>Analysis results by risk level</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.riskDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8">
                  {stats.riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
            <CardDescription>Your security activity at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-success" />
                  <span>Safe Interactions</span>
                </div>
                <span className="font-bold">{stats.totalScans - stats.threatsBlocked}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  <span>Warnings Detected</span>
                </div>
                <span className="font-bold">{Math.floor(stats.threatsBlocked * 0.6)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-danger" />
                  <span>Dangerous Threats</span>
                </div>
                <span className="font-bold">{Math.floor(stats.threatsBlocked * 0.4)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

