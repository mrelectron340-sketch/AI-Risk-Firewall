import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  Shield, 
  FileCode, 
  Globe, 
  Coins,
  Wallet,
  Zap,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

const faqs = [
  {
    category: "Getting Started",
    icon: Shield,
    questions: [
      {
        q: "What is AI Risk Firewall?",
        a: "AI Risk Firewall is a comprehensive security tool that protects crypto users by analyzing smart contracts, websites, and tokens for potential scams and security risks using advanced AI technology.",
      },
      {
        q: "How do I connect my wallet?",
        a: "Click the 'Connect Wallet' button in the top right corner. Make sure you have MetaMask or a compatible wallet installed. The app works best on Polygon Amoy testnet.",
      },
      {
        q: "Is it free to use?",
        a: "Yes! We offer 10 free scans per month. You can upgrade to Premium for unlimited scans at 0.01 MATIC/month, or pay per scan at 0.001 MATIC.",
      },
    ],
  },
  {
    category: "Features",
    icon: Zap,
    questions: [
      {
        q: "What can I scan?",
        a: "You can scan websites for phishing, analyze smart contracts for vulnerabilities, check tokens for honeypots and rug pulls, and simulate transactions before executing them.",
      },
      {
        q: "How accurate is the AI analysis?",
        a: "Our AI uses GPT-4 and is trained on thousands of known scams. While highly accurate, always do your own research (DYOR) before making financial decisions.",
      },
      {
        q: "What is a Safety NFT?",
        a: "A Safety NFT is a soulbound (non-transferable) NFT that represents your wallet's security reputation. It tracks your safety score, scams avoided, and safe transactions.",
      },
    ],
  },
  {
    category: "Security",
    icon: Shield,
    questions: [
      {
        q: "Is my wallet safe?",
        a: "Yes! We never ask for your private keys. All wallet interactions happen through MetaMask. We only read public blockchain data and never store sensitive information.",
      },
      {
        q: "What if the AI analysis fails?",
        a: "If the AI API is unavailable, we use heuristic analysis based on known patterns. You'll see a warning, and we recommend proceeding with caution.",
      },
      {
        q: "Can I trust the risk scores?",
        a: "Risk scores are AI-generated estimates. A high score (90+) means safer, while low scores (0-59) indicate danger. Always verify important transactions manually.",
      },
    ],
  },
  {
    category: "Troubleshooting",
    icon: AlertCircle,
    questions: [
      {
        q: "Why can't I connect my wallet?",
        a: "Make sure MetaMask is installed and unlocked. Check that you're on the correct network (Polygon Amoy for testnet). Try refreshing the page.",
      },
      {
        q: "The scan is taking too long",
        a: "AI analysis can take 10-30 seconds. If it's taking longer, check your internet connection. You can try again or contact support.",
      },
      {
        q: "I'm out of free scans",
        a: "You can upgrade to Premium for unlimited scans, or purchase individual scans. Visit the Pricing page to subscribe.",
      },
    ],
  },
];

const features = [
  {
    icon: Globe,
    title: "Website Scanner",
    description: "Detect phishing sites and fake DApp clones",
  },
  {
    icon: FileCode,
    title: "Contract Analyzer",
    description: "AI-powered analysis of smart contract security",
  },
  {
    icon: Coins,
    title: "Token Checker",
    description: "Check tokens for honeypots, rug pulls, and scams",
  },
  {
    icon: Zap,
    title: "Transaction Simulator",
    description: "Simulate transactions before executing them",
  },
  {
    icon: Wallet,
    title: "Safety NFT",
    description: "Track your wallet's security reputation",
  },
  {
    icon: Shield,
    title: "Risk Registry",
    description: "On-chain database of reported scams",
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <HelpCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know about AI Risk Firewall
        </p>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <Card key={idx}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* FAQs */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        {faqs.map((category, catIdx) => {
          const Icon = category.icon;
          return (
            <Card key={catIdx}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, faqIdx) => (
                    <AccordionItem key={faqIdx} value={`item-${catIdx}-${faqIdx}`}>
                      <AccordionTrigger>{faq.q}</AccordionTrigger>
                      <AccordionContent>{faq.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Safety Tips</CardTitle>
          <CardDescription>Best practices for staying safe in crypto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Always Verify Contracts</h4>
                <p className="text-sm text-muted-foreground">
                  Check contract addresses carefully. Scammers often use similar addresses.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Use Transaction Simulator</h4>
                <p className="text-sm text-muted-foreground">
                  Always simulate transactions before executing, especially for large amounts.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Check Website URLs</h4>
                <p className="text-sm text-muted-foreground">
                  Phishing sites often use typosquatting. Always verify the exact domain.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Never Share Private Keys</h4>
                <p className="text-sm text-muted-foreground">
                  Legitimate services never ask for your private keys or seed phrases.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle>Need More Help?</CardTitle>
          <CardDescription>We're here to assist you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              If you can't find the answer you're looking for, please reach out to our support team.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Email: support@airiskfirewall.com</Badge>
              <Badge variant="outline">Discord: discord.gg/airiskfirewall</Badge>
              <Badge variant="outline">Twitter: @airiskfirewall</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

