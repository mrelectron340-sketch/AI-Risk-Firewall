import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Shield, Crown, Sparkles } from "lucide-react";
import { useWallet } from "@/components/wallet-connection";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    name: "Free",
    price: "0",
    priceUnit: "MATIC",
    description: "Perfect for getting started",
    features: [
      "10 free scans per month",
      "Basic contract analysis",
      "Token safety checks",
      "Website phishing detection",
      "Basic risk scores",
    ],
    icon: Shield,
    popular: false,
  },
  {
    name: "Premium",
    price: "0.01",
    priceUnit: "MATIC/month",
    description: "For power users and traders",
    features: [
      "Unlimited scans",
      "Advanced AI analysis",
      "Real-time transaction simulation",
      "Priority support",
      "Detailed risk reports",
      "Wallet reputation tracking",
      "Early access to new features",
    ],
    icon: Crown,
    popular: true,
  },
  {
    name: "Pay Per Scan",
    price: "0.001",
    priceUnit: "MATIC/scan",
    description: "Pay only when you need it",
    features: [
      "Single scan purchase",
      "Full AI analysis",
      "No subscription required",
      "Perfect for occasional users",
    ],
    icon: Zap,
    popular: false,
  },
];

export default function PricingPage() {
  const { isConnected, address } = useWallet();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: string) => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to subscribe",
        variant: "destructive",
      });
      return;
    }

    setLoading(plan);
    try {
      // TODO: Integrate with ScannerAccess contract
      // const { ethereum } = window;
      // const provider = new ethers.BrowserProvider(ethereum);
      // const signer = await provider.getSigner();
      // const scannerAccess = getContract(SCANNER_ACCESS_ADDRESS, SCANNER_ACCESS_ABI, signer);
      
      // if (plan === "Premium") {
      //   const tx = await scannerAccess.subscribePremium({ value: ethers.parseEther("0.01") });
      //   await tx.wait();
      // } else if (plan === "Pay Per Scan") {
      //   const tx = await scannerAccess.payPerScan({ value: ethers.parseEther("0.001") });
      //   await tx.wait();
      // }
      
      toast({
        title: "Success!",
        description: `${plan} subscription activated`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to subscribe",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold">Choose Your Plan</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Start with free scans or upgrade for unlimited protection
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`relative h-full ${
                  plan.popular
                    ? "border-primary shadow-lg scale-105"
                    : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-6 h-6 text-primary" />
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">
                      {plan.priceUnit}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleSubscribe(plan.name)}
                    disabled={loading === plan.name || !isConnected}
                  >
                    {loading === plan.name ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : plan.name === "Free" ? (
                      "Current Plan"
                    ) : (
                      `Subscribe to ${plan.name}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center space-y-4 max-w-2xl mx-auto mt-12"
      >
        <Card>
          <CardHeader>
            <CardTitle>Why Upgrade?</CardTitle>
            <CardDescription>
              Premium features help you stay ahead of threats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Advanced AI Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Deep contract analysis with multiple AI models
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Real-time Protection</h4>
                  <p className="text-sm text-muted-foreground">
                    Instant alerts and transaction blocking
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Crown className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Priority Support</h4>
                  <p className="text-sm text-muted-foreground">
                    Get help when you need it most
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Early Access</h4>
                  <p className="text-sm text-muted-foreground">
                    Try new features before everyone else
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

