import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { WalletProvider, WalletButton } from "@/components/wallet-connection";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SplashScreen } from "@/components/splash-screen";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Scanner from "@/pages/scanner";
import ContractAnalyzer from "@/pages/contracts";
import TokenChecker from "@/pages/tokens";
import TrustNFTPage from "@/pages/trust-nft";
import RegistryPage from "@/pages/registry";
import SettingsPage from "@/pages/settings";
import PricingPage from "@/pages/pricing";
import AnalyticsPage from "@/pages/analytics";
import TransactionSimulatorPage from "@/pages/transaction-simulator";
import HelpPage from "@/pages/help";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/scanner" component={Scanner} />
      <Route path="/contracts" component={ContractAnalyzer} />
      <Route path="/tokens" component={TokenChecker} />
      <Route path="/trust-nft" component={TrustNFTPage} />
      <Route path="/registry" component={RegistryPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/analytics" component={AnalyticsPage} />
      <Route path="/simulator" component={TransactionSimulatorPage} />
      <Route path="/help" component={HelpPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3.5rem",
  };

  if (showSplash) {
    return (
      <ThemeProvider defaultTheme="dark">
        <SplashScreen onComplete={() => setShowSplash(false)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WalletProvider>
            <SidebarProvider style={sidebarStyle as React.CSSProperties}>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1 min-w-0">
                  <header className="flex items-center justify-between gap-4 p-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <SidebarTrigger data-testid="button-sidebar-toggle" />
                    <WalletButton />
                  </header>
                  <main className="flex-1 overflow-auto">
                    <div className="container max-w-6xl mx-auto p-6">
                      <Router />
                    </div>
                  </main>
                </div>
              </div>
            </SidebarProvider>
            <Toaster />
          </WalletProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
