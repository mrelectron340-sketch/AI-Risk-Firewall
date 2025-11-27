import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  scanWebsiteRequestSchema, 
  analyzeContractRequestSchema, 
  analyzeTokenRequestSchema,
  checkWalletRequestSchema
} from "@shared/schema";
import { 
  analyzeWebsiteUrl, 
  analyzeSmartContract, 
  analyzeToken 
} from "./openai";
import { ZodError } from "zod";

function getTierFromScore(score: number): "bronze" | "silver" | "gold" | "platinum" | "diamond" {
  if (score >= 91) return "diamond";
  if (score >= 71) return "platinum";
  if (score >= 51) return "gold";
  if (score >= 31) return "silver";
  return "bronze";
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Website scanning endpoint
  app.post("/api/scan-website", async (req, res) => {
    try {
      const { url } = scanWebsiteRequestSchema.parse(req.body);
      
      // Validate URL format
      try {
        new URL(url);
      } catch {
        return res.status(400).json({ error: "Invalid URL format" });
      }
      
      // Check if we've recently scanned this URL
      const existingScan = await storage.getWebsiteScanByUrl(url);
      if (existingScan) {
        const scanDate = new Date(existingScan.scanDate);
        const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
        if (scanDate > hourAgo) {
          return res.json(existingScan);
        }
      }
      
      // Perform AI analysis
      const analysis = await analyzeWebsiteUrl(url);
      
      // Extract domain
      let domain = url;
      try {
        domain = new URL(url).hostname;
      } catch {
        // If URL parsing fails, use the original URL
      }
      
      // Store scan result
      const scan = await storage.createWebsiteScan({
        url,
        domain,
        riskScore: analysis.riskScore,
        riskLevel: analysis.riskLevel,
        threats: analysis.threats,
        scanDate: new Date().toISOString(),
        isBlocked: analysis.isBlocked,
      });
      
      res.json(scan);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      console.error("Website scan error:", error);
      res.status(500).json({ error: "Failed to scan website. Please try again." });
    }
  });

  // Contract analysis endpoint
  app.post("/api/analyze-contract", async (req, res) => {
    try {
      const { address, chain } = analyzeContractRequestSchema.parse(req.body);
      
      // Validate address format
      if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return res.status(400).json({ error: "Invalid contract address format" });
      }
      
      // Check if we've recently analyzed this contract
      const existingAnalysis = await storage.getContractAnalysisByAddress(address);
      if (existingAnalysis) {
        const analysisDate = new Date(existingAnalysis.scanDate);
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        if (analysisDate > dayAgo) {
          return res.json(existingAnalysis);
        }
      }
      
      // Perform AI analysis
      const analysis = await analyzeSmartContract(address, chain);
      
      // Store analysis result
      const contractAnalysis = await storage.createContractAnalysis({
        address,
        chain,
        riskScore: analysis.riskScore,
        riskLevel: analysis.riskLevel,
        isVerified: analysis.isVerified,
        hasProxyPattern: analysis.hasProxyPattern,
        hasOwnerPrivileges: analysis.hasOwnerPrivileges,
        hasMintFunction: analysis.hasMintFunction,
        hasPauseFunction: analysis.hasPauseFunction,
        hasBlacklistFunction: analysis.hasBlacklistFunction,
        honeypotRisk: analysis.honeypotRisk,
        rugPullRisk: analysis.rugPullRisk,
        issues: analysis.issues,
        scanDate: new Date().toISOString(),
      });
      
      res.json(contractAnalysis);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      console.error("Contract analysis error:", error);
      res.status(500).json({ error: "Failed to analyze contract. Please try again." });
    }
  });

  // Token analysis endpoint
  app.post("/api/analyze-token", async (req, res) => {
    try {
      const { address, chain } = analyzeTokenRequestSchema.parse(req.body);
      
      // Validate address format
      if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return res.status(400).json({ error: "Invalid token address format" });
      }
      
      // Check if we've recently analyzed this token
      const existingAnalysis = await storage.getTokenAnalysisByAddress(address);
      if (existingAnalysis) {
        const analysisDate = new Date(existingAnalysis.scanDate);
        const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
        if (analysisDate > hourAgo) {
          return res.json(existingAnalysis);
        }
      }
      
      // Perform AI analysis
      const analysis = await analyzeToken(address, chain);
      
      // Store analysis result
      const tokenAnalysis = await storage.createTokenAnalysis({
        address,
        chain,
        name: analysis.name,
        symbol: analysis.symbol,
        riskScore: analysis.riskScore,
        riskLevel: analysis.riskLevel,
        liquidityLocked: analysis.liquidityLocked,
        liquidityAmount: analysis.liquidityAmount,
        lockDuration: analysis.lockDuration,
        ownershipRenounced: analysis.ownershipRenounced,
        buyTax: analysis.buyTax,
        sellTax: analysis.sellTax,
        maxTxLimit: analysis.maxTxLimit,
        maxWalletLimit: analysis.maxWalletLimit,
        canMint: analysis.canMint,
        canPause: analysis.canPause,
        canBlacklist: analysis.canBlacklist,
        isHoneypot: analysis.isHoneypot,
        topHoldersConcentration: analysis.topHoldersConcentration,
        scanDate: new Date().toISOString(),
      });
      
      res.json(tokenAnalysis);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      console.error("Token analysis error:", error);
      res.status(500).json({ error: "Failed to analyze token. Please try again." });
    }
  });

  // Wallet reputation check endpoint
  app.post("/api/check-wallet", async (req, res) => {
    try {
      const { address } = checkWalletRequestSchema.parse(req.body);
      
      // Validate address format
      if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return res.status(400).json({ error: "Invalid wallet address format" });
      }
      
      // Check existing reputation
      let reputation = await storage.getWalletReputation(address);
      
      if (!reputation) {
        // Create initial reputation (simulated)
        reputation = await storage.createWalletReputation({
          address,
          riskScore: 85,
          riskLevel: "safe",
          isBlacklisted: false,
          scamReports: 0,
          linkedToMixer: false,
          linkedToDrainer: false,
          totalVictims: 0,
          labels: [],
          scanDate: new Date().toISOString(),
        });
      }
      
      res.json(reputation);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      console.error("Wallet check error:", error);
      res.status(500).json({ error: "Failed to check wallet" });
    }
  });

  // Get Trust NFT for wallet
  app.get("/api/trust-nft/:address", async (req, res) => {
    try {
      const { address } = req.params;
      
      if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return res.status(400).json({ error: "Invalid wallet address" });
      }
      
      let nft = await storage.getTrustNFT(address);
      
      if (!nft) {
        // Create initial Trust NFT data (not minted yet)
        nft = await storage.createTrustNFT({
          walletAddress: address,
          trustScore: 100,
          scamsAvoided: 0,
          safeTransactions: 0,
          rank: "N/A",
          tier: "bronze",
          lastUpdated: new Date().toISOString(),
        });
      }
      
      res.json(nft);
    } catch (error) {
      console.error("Trust NFT error:", error);
      res.status(500).json({ error: "Failed to get Trust NFT" });
    }
  });

  // Mint Trust NFT
  app.post("/api/mint-trust-nft", async (req, res) => {
    try {
      const { walletAddress } = req.body;
      
      if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
        return res.status(400).json({ error: "Invalid wallet address" });
      }
      
      let nft = await storage.getTrustNFT(walletAddress);
      
      if (nft && nft.tokenId) {
        return res.status(400).json({ error: "Trust NFT already minted" });
      }
      
      // Simulate minting by generating a token ID
      const tokenId = `${Date.now()}`;
      
      if (nft) {
        nft = await storage.updateTrustNFT(walletAddress, {
          tokenId,
          lastUpdated: new Date().toISOString(),
        });
      } else {
        nft = await storage.createTrustNFT({
          walletAddress,
          tokenId,
          trustScore: 100,
          scamsAvoided: 0,
          safeTransactions: 0,
          rank: "N/A",
          tier: "bronze",
          lastUpdated: new Date().toISOString(),
        });
      }
      
      res.json(nft);
    } catch (error) {
      console.error("Mint error:", error);
      res.status(500).json({ error: "Failed to mint Trust NFT" });
    }
  });

  // Get protection activity logs
  app.get("/api/activities/:address", async (req, res) => {
    try {
      const { address } = req.params;
      
      if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return res.status(400).json({ error: "Invalid wallet address" });
      }
      
      const logs = await storage.getProtectionLogs(address);
      res.json(logs || []);
    } catch (error) {
      console.error("Activities error:", error);
      res.status(500).json({ error: "Failed to get activities" });
    }
  });

  // Get daily stats
  app.get("/api/stats/:address", async (req, res) => {
    try {
      const { address } = req.params;
      
      if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return res.status(400).json({ error: "Invalid wallet address" });
      }
      
      let report = await storage.getLatestDailyReport(address);
      
      if (!report) {
        // Create default stats for new users
        report = await storage.createDailyReport({
          walletAddress: address,
          date: new Date().toISOString().split("T")[0],
          threatsBlocked: 0,
          contractsFlagged: 0,
          tokensAnalyzed: 0,
          transactionsScanned: 0,
          riskySitesBlocked: 0,
          overallSafetyScore: 100,
        });
      }
      
      res.json(report);
    } catch (error) {
      console.error("Stats error:", error);
      res.status(500).json({ error: "Failed to get stats" });
    }
  });

  // Get contract registry
  app.get("/api/registry", async (req, res) => {
    try {
      const registry = await storage.getContractRegistry();
      res.json(registry || []);
    } catch (error) {
      console.error("Registry error:", error);
      res.status(500).json({ error: "Failed to get registry" });
    }
  });

  // Add to contract registry
  app.post("/api/registry", async (req, res) => {
    try {
      const { address, chain, name, status } = req.body;
      
      if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return res.status(400).json({ error: "Invalid contract address" });
      }
      
      const existing = await storage.getContractRegistryByAddress(address);
      if (existing) {
        return res.status(400).json({ error: "Contract already in registry" });
      }
      
      const entry = await storage.createContractRegistry({
        address,
        chain: chain || "polygon",
        name,
        status: status || "unverified",
        reportCount: 0,
        addedDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      });
      
      res.json(entry);
    } catch (error) {
      console.error("Registry add error:", error);
      res.status(500).json({ error: "Failed to add to registry" });
    }
  });

  // Transaction simulator endpoint
  app.post("/api/simulate-transaction", async (req, res) => {
    try {
      const { from, to, data } = req.body;
      
      if (!from || !to) {
        return res.status(400).json({ error: "From and to addresses are required" });
      }

      if (!/^0x[a-fA-F0-9]{40}$/.test(from) || !/^0x[a-fA-F0-9]{40}$/.test(to)) {
        return res.status(400).json({ error: "Invalid address format" });
      }

      // Use AI analyzer for simulation
      const { simulateTransaction } = await import("./ai-analyzer");
      const result = await simulateTransaction(from, to, data || "0x");
      
      res.json({
        ...result,
        estimatedGas: "~50,000", // Mock gas estimate
        tokenLoss: result.safe ? "0" : "Unknown - Review warnings",
      });
    } catch (error) {
      console.error("Transaction simulation error:", error);
      res.status(500).json({ 
        error: "Failed to simulate transaction",
        safe: false,
        riskScore: 50,
        warnings: ["Simulation unavailable - proceed with caution"],
        analysis: "Unable to analyze transaction. Please review manually before proceeding.",
      });
    }
  });

  // Analytics endpoint
  app.get("/api/analytics/:address", async (req, res) => {
    try {
      const { address } = req.params;
      
      if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return res.status(400).json({ error: "Invalid wallet address" });
      }

      // Get stats and activities to build analytics
      const stats = await storage.getLatestDailyReport(address);
      const activities = await storage.getProtectionLogs(address) || [];
      
      // Build analytics from real data
      const analytics = {
        totalScans: stats?.transactionsScanned || 0,
        threatsBlocked: stats?.threatsBlocked || 0,
        contractsAnalyzed: stats?.contractsFlagged || 0,
        tokensChecked: stats?.tokensAnalyzed || 0,
        safetyScore: stats?.overallSafetyScore || 100,
        weeklyData: [], // Can be enhanced with time-series data
        threatTypes: [],
        riskDistribution: [],
      };

      res.json(analytics);
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ error: "Failed to get analytics" });
    }
  });

  return httpServer;
}
