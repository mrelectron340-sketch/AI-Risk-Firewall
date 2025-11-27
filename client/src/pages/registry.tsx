import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ContractRegistry } from "@shared/schema";
import { 
  BookOpen, 
  Search,
  ShieldCheck,
  ShieldX,
  ShieldAlert,
  Shield,
  ExternalLink,
  Copy,
  Filter,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function RegistryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  const { data: contracts, isLoading } = useQuery<ContractRegistry[]>({
    queryKey: ["/api/registry"],
  });

  const mockContracts: ContractRegistry[] = contracts || [
    {
      id: "1",
      address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
      chain: "polygon",
      name: "MATIC Token",
      status: "safe",
      reportCount: 0,
      verifiedBy: "Polygon Foundation",
      addedDate: "2023-01-15T00:00:00Z",
      lastUpdated: "2024-11-01T00:00:00Z",
    },
    {
      id: "2",
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      chain: "polygon",
      name: "USD Coin (PoS)",
      status: "safe",
      reportCount: 0,
      verifiedBy: "Circle",
      addedDate: "2023-02-20T00:00:00Z",
      lastUpdated: "2024-10-15T00:00:00Z",
    },
    {
      id: "3",
      address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      chain: "polygon",
      name: "Fake Airdrop Token",
      status: "dangerous",
      reportCount: 156,
      addedDate: "2024-11-20T00:00:00Z",
      lastUpdated: "2024-11-25T00:00:00Z",
    },
    {
      id: "4",
      address: "0x1234567890abcdef1234567890abcdef12345678",
      chain: "polygon",
      name: "Unknown Token",
      status: "suspicious",
      reportCount: 23,
      addedDate: "2024-11-22T00:00:00Z",
      lastUpdated: "2024-11-25T00:00:00Z",
    },
    {
      id: "5",
      address: "0xabcdef1234567890abcdef1234567890abcdef12",
      chain: "polygon",
      name: "New Contract",
      status: "unverified",
      reportCount: 0,
      addedDate: "2024-11-27T00:00:00Z",
      lastUpdated: "2024-11-27T00:00:00Z",
    },
  ];

  const filteredContracts = mockContracts.filter((contract) => {
    const matchesSearch = 
      contract.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contract.name?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTab = activeTab === "all" || contract.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const getStatusConfig = (status: ContractRegistry["status"]) => {
    switch (status) {
      case "safe":
        return {
          icon: ShieldCheck,
          label: "Safe",
          color: "text-success",
          bgColor: "bg-success/10",
          badgeClass: "bg-success/10 text-success border-success/20",
        };
      case "dangerous":
        return {
          icon: ShieldX,
          label: "Dangerous",
          color: "text-danger",
          bgColor: "bg-danger/10",
          badgeClass: "bg-danger/10 text-danger border-danger/20",
        };
      case "suspicious":
        return {
          icon: ShieldAlert,
          label: "Suspicious",
          color: "text-warning",
          bgColor: "bg-warning/10",
          badgeClass: "bg-warning/10 text-warning border-warning/20",
        };
      case "unverified":
        return {
          icon: Shield,
          label: "Unverified",
          color: "text-muted-foreground",
          bgColor: "bg-muted",
          badgeClass: "bg-muted text-muted-foreground",
        };
    }
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Copied",
      description: "Address copied to clipboard",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statusCounts = {
    all: mockContracts.length,
    safe: mockContracts.filter(c => c.status === "safe").length,
    dangerous: mockContracts.filter(c => c.status === "dangerous").length,
    suspicious: mockContracts.filter(c => c.status === "suspicious").length,
    unverified: mockContracts.filter(c => c.status === "unverified").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contract Registry</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          On-chain database of verified safe and dangerous contracts
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Browse Registry
          </CardTitle>
          <CardDescription>
            Search and filter the decentralized contract safety registry stored on Polygon
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by address or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-registry"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all" data-testid="tab-all">
                All ({statusCounts.all})
              </TabsTrigger>
              <TabsTrigger value="safe" data-testid="tab-safe">
                Safe ({statusCounts.safe})
              </TabsTrigger>
              <TabsTrigger value="dangerous" data-testid="tab-dangerous">
                Danger ({statusCounts.dangerous})
              </TabsTrigger>
              <TabsTrigger value="suspicious" data-testid="tab-suspicious">
                Suspect ({statusCounts.suspicious})
              </TabsTrigger>
              <TabsTrigger value="unverified" data-testid="tab-unverified">
                New ({statusCounts.unverified})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredContracts.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="font-semibold mb-1">No contracts found</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {searchQuery 
                  ? "Try adjusting your search query or filter"
                  : "No contracts in this category yet"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredContracts.map((contract) => {
            const statusConfig = getStatusConfig(contract.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <Card key={contract.id} className="hover-elevate" data-testid={`registry-item-${contract.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={cn("p-2.5 rounded-lg", statusConfig.bgColor)}>
                      <StatusIcon className={cn("w-5 h-5", statusConfig.color)} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">
                              {contract.name || "Unknown Contract"}
                            </h3>
                            <Badge variant="outline" className={statusConfig.badgeClass}>
                              {statusConfig.label}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {contract.chain}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                              {contract.address.slice(0, 10)}...{contract.address.slice(-8)}
                            </code>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => copyAddress(contract.address)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {contract.reportCount > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {contract.reportCount} reports
                            </Badge>
                          )}
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href="#"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        {contract.verifiedBy && (
                          <div className="flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-success" />
                            Verified by {contract.verifiedBy}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Updated {formatDate(contract.lastUpdated)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Report a Contract</p>
              <p className="text-xs text-muted-foreground">
                Help protect the community by reporting suspicious or dangerous contracts
              </p>
            </div>
            <Button variant="outline" size="sm" data-testid="button-report-contract">
              Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
