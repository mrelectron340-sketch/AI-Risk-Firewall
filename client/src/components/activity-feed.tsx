import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RiskIcon } from "@/components/risk-score";
import type { ProtectionLog, RiskLevel } from "@shared/schema";
import { 
  Globe, 
  FileCode, 
  ArrowRightLeft, 
  Coins, 
  Wallet,
  Clock,
  ShieldBan,
  ShieldAlert,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityFeedProps {
  activities: ProtectionLog[];
  className?: string;
  maxItems?: number;
}

export function ActivityFeed({ activities, className, maxItems = 10 }: ActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems);

  const getActionIcon = (actionType: ProtectionLog["actionType"]) => {
    switch (actionType) {
      case "website_blocked":
        return Globe;
      case "contract_flagged":
        return FileCode;
      case "transaction_blocked":
        return ArrowRightLeft;
      case "token_warning":
        return Coins;
      case "wallet_flagged":
        return Wallet;
      default:
        return ShieldAlert;
    }
  };

  const getActionLabel = (actionType: ProtectionLog["actionType"]) => {
    switch (actionType) {
      case "website_blocked":
        return "Website Blocked";
      case "contract_flagged":
        return "Contract Flagged";
      case "transaction_blocked":
        return "Transaction Blocked";
      case "token_warning":
        return "Token Warning";
      case "wallet_flagged":
        return "Wallet Flagged";
      default:
        return "Alert";
    }
  };

  const getActionColor = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case "safe":
        return "text-success";
      case "warning":
        return "text-warning";
      case "danger":
        return "text-danger";
      default:
        return "text-muted-foreground";
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (displayActivities.length === 0) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ShieldCheck className="w-12 h-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No recent activity</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Your protection logs will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[320px]">
          <div className="space-y-0">
            {displayActivities.map((activity, index) => {
              const ActionIcon = getActionIcon(activity.actionType);
              return (
                <div
                  key={activity.id}
                  className={cn(
                    "flex items-start gap-3 px-6 py-3 hover-elevate",
                    index !== displayActivities.length - 1 && "border-b"
                  )}
                  data-testid={`activity-item-${activity.id}`}
                >
                  <div className={cn(
                    "mt-0.5 p-1.5 rounded-md",
                    activity.riskLevel === "danger" && "bg-danger/10",
                    activity.riskLevel === "warning" && "bg-warning/10",
                    activity.riskLevel === "safe" && "bg-success/10"
                  )}>
                    <ActionIcon className={cn(
                      "w-4 h-4",
                      getActionColor(activity.riskLevel)
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium">
                        {getActionLabel(activity.actionType)}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs px-1.5 py-0",
                          activity.riskLevel === "danger" && "border-danger/30 text-danger",
                          activity.riskLevel === "warning" && "border-warning/30 text-warning",
                          activity.riskLevel === "safe" && "border-success/30 text-success"
                        )}
                      >
                        {activity.riskScore}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.description}
                    </p>
                    {(activity.targetUrl || activity.targetAddress) && (
                      <p className="text-xs font-mono text-muted-foreground/70 truncate mt-0.5">
                        {activity.targetUrl || activity.targetAddress}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
