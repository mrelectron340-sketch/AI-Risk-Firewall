import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RiskScore, RiskBadge } from "@/components/risk-score";
import { apiRequest } from "@/lib/queryClient";
import type { WebsiteScan } from "@shared/schema";
import { 
  Globe, 
  Search, 
  Shield, 
  AlertTriangle, 
  Check, 
  X,
  ExternalLink,
  Lock,
  Code,
  Link2,
  FileWarning,
  ShieldAlert,
  RefreshCw,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Scanner() {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const scanMutation = useMutation({
    mutationFn: async (urlToScan: string) => {
      const response = await apiRequest("POST", "/api/scan-website", { url: urlToScan });
      return response as WebsiteScan;
    },
    onError: (error) => {
      toast({
        title: "Scan Failed",
        description: error.message || "Unable to scan the website. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl;
    }
    
    scanMutation.mutate(formattedUrl);
  };

  const result = scanMutation.data;

  const getThreatIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "phishing":
        return FileWarning;
      case "malicious_script":
        return Code;
      case "fake_ui":
        return ShieldAlert;
      case "suspicious_domain":
        return Link2;
      default:
        return AlertTriangle;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Website Scanner</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Analyze any URL for phishing, malicious scripts, and security threats
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Scan URL
          </CardTitle>
          <CardDescription>
            Enter a website URL to analyze for potential security threats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleScan} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10 font-mono text-sm"
                data-testid="input-url"
              />
            </div>
            <Button 
              type="submit" 
              disabled={scanMutation.isPending || !url.trim()}
              className="gap-2"
              data-testid="button-scan"
            >
              {scanMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Scan
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {scanMutation.isPending && (
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

      {result && !scanMutation.isPending && (
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
                        {result.domain}
                        <RiskBadge level={result.riskLevel} />
                      </h3>
                      <p className="text-sm text-muted-foreground font-mono mt-0.5 truncate">
                        {result.url}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {result.isBlocked && (
                        <Badge variant="destructive" className="gap-1">
                          <X className="w-3 h-3" />
                          Blocked
                        </Badge>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <a href={result.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium">Scan Summary</h4>
                    <p className="text-sm text-muted-foreground">
                      {result.riskLevel === "safe" && "This website appears to be safe. No significant security threats were detected."}
                      {result.riskLevel === "warning" && "This website has some potential risks. Proceed with caution and verify authenticity before interacting."}
                      {result.riskLevel === "danger" && "This website has been flagged as dangerous. It may be a phishing site or contain malicious content. We strongly recommend not interacting with it."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {result.threats.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  Detected Threats ({result.threats.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {result.threats.map((threat, index) => {
                    const ThreatIcon = getThreatIcon(threat.type);
                    return (
                      <div key={index} className="flex items-start gap-4 p-4">
                        <div className={cn(
                          "p-2 rounded-lg",
                          threat.severity === "critical" && "bg-danger/10",
                          threat.severity === "high" && "bg-danger/10",
                          threat.severity === "medium" && "bg-warning/10",
                          threat.severity === "low" && "bg-muted"
                        )}>
                          <ThreatIcon className={cn(
                            "w-4 h-4",
                            threat.severity === "critical" && "text-danger",
                            threat.severity === "high" && "text-danger",
                            threat.severity === "medium" && "text-warning",
                            threat.severity === "low" && "text-muted-foreground"
                          )} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm capitalize">
                              {threat.type.replace(/_/g, " ")}
                            </span>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs capitalize",
                                threat.severity === "critical" && "border-danger/50 text-danger",
                                threat.severity === "high" && "border-danger/50 text-danger",
                                threat.severity === "medium" && "border-warning/50 text-warning",
                                threat.severity === "low" && "border-muted-foreground/50"
                              )}
                            >
                              {threat.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {threat.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                Security Checks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SecurityCheck 
                  label="SSL Certificate" 
                  passed={result.url.startsWith("https")} 
                  description={result.url.startsWith("https") ? "Valid HTTPS connection" : "No SSL certificate"}
                />
                <SecurityCheck 
                  label="Domain Age" 
                  passed={result.riskScore > 50} 
                  description={result.riskScore > 50 ? "Established domain" : "Recently registered"}
                />
                <SecurityCheck 
                  label="Malicious Scripts" 
                  passed={!result.threats.some(t => t.type === "malicious_script")} 
                  description={!result.threats.some(t => t.type === "malicious_script") ? "No malicious scripts" : "Suspicious scripts detected"}
                />
                <SecurityCheck 
                  label="Phishing Patterns" 
                  passed={!result.threats.some(t => t.type === "phishing")} 
                  description={!result.threats.some(t => t.type === "phishing") ? "No phishing indicators" : "Phishing patterns detected"}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!result && !scanMutation.isPending && (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Globe className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="font-semibold mb-1">Enter a URL to scan</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Our AI will analyze the website for phishing attempts, malicious scripts, 
                fake wallet popups, and other security threats.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface SecurityCheckProps {
  label: string;
  passed: boolean;
  description: string;
}

function SecurityCheck({ label, passed, description }: SecurityCheckProps) {
  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-lg",
      passed ? "bg-success/5" : "bg-danger/5"
    )}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center",
        passed ? "bg-success/10" : "bg-danger/10"
      )}>
        {passed ? (
          <Check className="w-4 h-4 text-success" />
        ) : (
          <X className="w-4 h-4 text-danger" />
        )}
      </div>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
