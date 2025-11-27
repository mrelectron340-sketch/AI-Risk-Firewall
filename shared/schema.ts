import { z } from "zod";

// Risk levels for the scoring system
export type RiskLevel = "safe" | "warning" | "danger";

// Website scan result
export const websiteScanSchema = z.object({
  id: z.string(),
  url: z.string(),
  domain: z.string(),
  riskScore: z.number().min(0).max(100),
  riskLevel: z.enum(["safe", "warning", "danger"]),
  threats: z.array(z.object({
    type: z.string(),
    severity: z.enum(["low", "medium", "high", "critical"]),
    description: z.string(),
  })),
  scanDate: z.string(),
  isBlocked: z.boolean(),
});
export type WebsiteScan = z.infer<typeof websiteScanSchema>;
export type InsertWebsiteScan = Omit<WebsiteScan, "id">;

// Smart contract analysis result
export const contractAnalysisSchema = z.object({
  id: z.string(),
  address: z.string(),
  chain: z.string(),
  name: z.string().optional(),
  riskScore: z.number().min(0).max(100),
  riskLevel: z.enum(["safe", "warning", "danger"]),
  isVerified: z.boolean(),
  hasProxyPattern: z.boolean(),
  hasOwnerPrivileges: z.boolean(),
  hasMintFunction: z.boolean(),
  hasPauseFunction: z.boolean(),
  hasBlacklistFunction: z.boolean(),
  honeypotRisk: z.boolean(),
  rugPullRisk: z.boolean(),
  issues: z.array(z.object({
    type: z.string(),
    severity: z.enum(["low", "medium", "high", "critical"]),
    description: z.string(),
  })),
  scanDate: z.string(),
});
export type ContractAnalysis = z.infer<typeof contractAnalysisSchema>;
export type InsertContractAnalysis = Omit<ContractAnalysis, "id">;

// Token safety analysis
export const tokenAnalysisSchema = z.object({
  id: z.string(),
  address: z.string(),
  chain: z.string(),
  name: z.string(),
  symbol: z.string(),
  riskScore: z.number().min(0).max(100),
  riskLevel: z.enum(["safe", "warning", "danger"]),
  liquidityLocked: z.boolean(),
  liquidityAmount: z.string().optional(),
  lockDuration: z.string().optional(),
  ownershipRenounced: z.boolean(),
  buyTax: z.number(),
  sellTax: z.number(),
  maxTxLimit: z.boolean(),
  maxWalletLimit: z.boolean(),
  canMint: z.boolean(),
  canPause: z.boolean(),
  canBlacklist: z.boolean(),
  isHoneypot: z.boolean(),
  topHoldersConcentration: z.number(),
  scanDate: z.string(),
});
export type TokenAnalysis = z.infer<typeof tokenAnalysisSchema>;
export type InsertTokenAnalysis = Omit<TokenAnalysis, "id">;

// Wallet/address reputation
export const walletReputationSchema = z.object({
  id: z.string(),
  address: z.string(),
  riskScore: z.number().min(0).max(100),
  riskLevel: z.enum(["safe", "warning", "danger"]),
  isBlacklisted: z.boolean(),
  scamReports: z.number(),
  linkedToMixer: z.boolean(),
  linkedToDrainer: z.boolean(),
  totalVictims: z.number(),
  firstSeen: z.string().optional(),
  labels: z.array(z.string()),
  scanDate: z.string(),
});
export type WalletReputation = z.infer<typeof walletReputationSchema>;
export type InsertWalletReputation = Omit<WalletReputation, "id">;

// Trust NFT data
export const trustNFTSchema = z.object({
  id: z.string(),
  walletAddress: z.string(),
  tokenId: z.string().optional(),
  trustScore: z.number().min(0).max(100),
  scamsAvoided: z.number(),
  safeTransactions: z.number(),
  rank: z.string(),
  tier: z.enum(["bronze", "silver", "gold", "platinum", "diamond"]),
  lastUpdated: z.string(),
});
export type TrustNFT = z.infer<typeof trustNFTSchema>;
export type InsertTrustNFT = Omit<TrustNFT, "id">;

// Protection activity log
export const protectionLogSchema = z.object({
  id: z.string(),
  walletAddress: z.string(),
  actionType: z.enum(["website_blocked", "contract_flagged", "transaction_blocked", "token_warning", "wallet_flagged"]),
  targetAddress: z.string().optional(),
  targetUrl: z.string().optional(),
  riskScore: z.number(),
  riskLevel: z.enum(["safe", "warning", "danger"]),
  description: z.string(),
  timestamp: z.string(),
  txHash: z.string().optional(),
});
export type ProtectionLog = z.infer<typeof protectionLogSchema>;
export type InsertProtectionLog = Omit<ProtectionLog, "id">;

// Contract registry entry
export const contractRegistrySchema = z.object({
  id: z.string(),
  address: z.string(),
  chain: z.string(),
  name: z.string().optional(),
  status: z.enum(["safe", "dangerous", "suspicious", "unverified"]),
  reportCount: z.number(),
  verifiedBy: z.string().optional(),
  addedDate: z.string(),
  lastUpdated: z.string(),
});
export type ContractRegistry = z.infer<typeof contractRegistrySchema>;
export type InsertContractRegistry = Omit<ContractRegistry, "id">;

// Daily protection report
export const dailyReportSchema = z.object({
  id: z.string(),
  walletAddress: z.string(),
  date: z.string(),
  threatsBlocked: z.number(),
  contractsFlagged: z.number(),
  tokensAnalyzed: z.number(),
  transactionsScanned: z.number(),
  riskySitesBlocked: z.number(),
  overallSafetyScore: z.number(),
});
export type DailyReport = z.infer<typeof dailyReportSchema>;
export type InsertDailyReport = Omit<DailyReport, "id">;

// API request schemas
export const scanWebsiteRequestSchema = z.object({
  url: z.string().url(),
});
export type ScanWebsiteRequest = z.infer<typeof scanWebsiteRequestSchema>;

export const analyzeContractRequestSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  chain: z.string().default("polygon"),
});
export type AnalyzeContractRequest = z.infer<typeof analyzeContractRequestSchema>;

export const analyzeTokenRequestSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  chain: z.string().default("polygon"),
});
export type AnalyzeTokenRequest = z.infer<typeof analyzeTokenRequestSchema>;

export const checkWalletRequestSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});
export type CheckWalletRequest = z.infer<typeof checkWalletRequestSchema>;

// Deprecated user schema - keeping for compatibility
export const users = {
  id: "",
  username: "",
  password: "",
};
export type User = typeof users;
export type InsertUser = Omit<User, "id">;
