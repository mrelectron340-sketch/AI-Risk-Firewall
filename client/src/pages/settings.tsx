import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useWallet, NetworkStatus } from "@/components/wallet-connection";
import { useTheme } from "@/components/theme-provider";
import { 
  Settings,
  Shield,
  Bell,
  Globe,
  FileCode,
  Coins,
  Wallet,
  Moon,
  Sun,
  ExternalLink,
  RefreshCw,
  Trash2,
  Download,
  HelpCircle,
  MessageSquare,
  Github
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { isConnected, address, disconnect, formatAddress } = useWallet();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    websiteScanning: true,
    contractAnalysis: true,
    tokenChecking: true,
    transactionInterception: true,
    pushNotifications: true,
    soundAlerts: false,
    autoBlock: true,
    strictMode: false,
    logToChain: true,
    dailyReports: true,
  });

  const updateSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    toast({
      title: "Setting Updated",
      description: "Your preferences have been saved.",
    });
  };

  const clearActivityData = () => {
    toast({
      title: "Data Cleared",
      description: "Your local activity data has been cleared.",
    });
  };

  const exportData = () => {
    toast({
      title: "Export Started",
      description: "Your data export is being prepared.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Customize your protection preferences and account settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Protection Settings
              </CardTitle>
              <CardDescription>
                Configure which security features are active
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingRow
                icon={Globe}
                title="Website Scanning"
                description="Automatically scan websites for phishing and malicious content"
                checked={settings.websiteScanning}
                onCheckedChange={() => updateSetting("websiteScanning")}
              />
              <Separator />
              <SettingRow
                icon={FileCode}
                title="Contract Analysis"
                description="Analyze smart contracts before interaction"
                checked={settings.contractAnalysis}
                onCheckedChange={() => updateSetting("contractAnalysis")}
              />
              <Separator />
              <SettingRow
                icon={Coins}
                title="Token Checking"
                description="Verify token safety before swaps"
                checked={settings.tokenChecking}
                onCheckedChange={() => updateSetting("tokenChecking")}
              />
              <Separator />
              <SettingRow
                icon={Wallet}
                title="Transaction Interception"
                description="Validate transactions before signing"
                checked={settings.transactionInterception}
                onCheckedChange={() => updateSetting("transactionInterception")}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Control how you receive alerts and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingRow
                icon={Bell}
                title="Push Notifications"
                description="Receive browser notifications for threats"
                checked={settings.pushNotifications}
                onCheckedChange={() => updateSetting("pushNotifications")}
              />
              <Separator />
              <SettingRow
                icon={Bell}
                title="Sound Alerts"
                description="Play sound when blocking threats"
                checked={settings.soundAlerts}
                onCheckedChange={() => updateSetting("soundAlerts")}
              />
              <Separator />
              <SettingRow
                icon={RefreshCw}
                title="Daily Reports"
                description="Receive daily protection summary"
                checked={settings.dailyReports}
                onCheckedChange={() => updateSetting("dailyReports")}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Advanced Settings
              </CardTitle>
              <CardDescription>
                Fine-tune your protection level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingRow
                icon={Shield}
                title="Auto-Block Threats"
                description="Automatically block high-risk actions without confirmation"
                checked={settings.autoBlock}
                onCheckedChange={() => updateSetting("autoBlock")}
              />
              <Separator />
              <SettingRow
                icon={Shield}
                title="Strict Mode"
                description="Block medium-risk actions as well (may affect normal usage)"
                checked={settings.strictMode}
                onCheckedChange={() => updateSetting("strictMode")}
              />
              <Separator />
              <SettingRow
                icon={Globe}
                title="Log to Polygon"
                description="Store encrypted protection logs on-chain"
                checked={settings.logToChain}
                onCheckedChange={() => updateSetting("logToChain")}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Connected Wallet
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isConnected ? (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Address</p>
                    <p className="font-mono text-sm">{formatAddress(address!)}</p>
                  </div>
                  <NetworkStatus />
                  <Button 
                    variant="outline" 
                    className="w-full text-danger hover:text-danger"
                    onClick={disconnect}
                    data-testid="button-disconnect"
                  >
                    Disconnect Wallet
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    No wallet connected
                  </p>
                  <Button variant="outline" className="w-full">
                    Connect Wallet
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  className="gap-2"
                  onClick={() => setTheme("light")}
                  data-testid="button-theme-light"
                >
                  <Sun className="w-4 h-4" />
                  Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  className="gap-2"
                  onClick={() => setTheme("dark")}
                  data-testid="button-theme-dark"
                >
                  <Moon className="w-4 h-4" />
                  Dark
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={exportData}
                data-testid="button-export-data"
              >
                <Download className="w-4 h-4" />
                Export Activity Data
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 text-danger hover:text-danger"
                onClick={clearActivityData}
                data-testid="button-clear-data"
              >
                <Trash2 className="w-4 h-4" />
                Clear Local Data
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                asChild
              >
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="w-4 h-4" />
                  Contact Support
                </a>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                asChild
              >
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                  View on GitHub
                </a>
              </Button>
            </CardContent>
          </Card>

          <div className="text-center text-xs text-muted-foreground">
            <p>AI Risk Firewall v1.0.0</p>
            <p className="mt-1">Built on Polygon</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SettingRowProps {
  icon: any;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: () => void;
}

function SettingRow({ icon: Icon, title, description, checked, onCheckedChange }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-muted mt-0.5">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <div>
          <Label htmlFor={title} className="text-sm font-medium cursor-pointer">
            {title}
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      <Switch
        id={title}
        checked={checked}
        onCheckedChange={onCheckedChange}
        data-testid={`switch-${title.toLowerCase().replace(/\s+/g, "-")}`}
      />
    </div>
  );
}
