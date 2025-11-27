import type { 
  WebsiteScan, 
  InsertWebsiteScan,
  ContractAnalysis, 
  InsertContractAnalysis,
  TokenAnalysis, 
  InsertTokenAnalysis,
  WalletReputation, 
  InsertWalletReputation,
  TrustNFT, 
  InsertTrustNFT,
  ProtectionLog, 
  InsertProtectionLog,
  ContractRegistry, 
  InsertContractRegistry,
  DailyReport, 
  InsertDailyReport
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Website scans
  createWebsiteScan(scan: InsertWebsiteScan): Promise<WebsiteScan>;
  getWebsiteScan(id: string): Promise<WebsiteScan | undefined>;
  getWebsiteScanByUrl(url: string): Promise<WebsiteScan | undefined>;
  
  // Contract analysis
  createContractAnalysis(analysis: InsertContractAnalysis): Promise<ContractAnalysis>;
  getContractAnalysis(id: string): Promise<ContractAnalysis | undefined>;
  getContractAnalysisByAddress(address: string): Promise<ContractAnalysis | undefined>;
  
  // Token analysis
  createTokenAnalysis(analysis: InsertTokenAnalysis): Promise<TokenAnalysis>;
  getTokenAnalysis(id: string): Promise<TokenAnalysis | undefined>;
  getTokenAnalysisByAddress(address: string): Promise<TokenAnalysis | undefined>;
  
  // Wallet reputation
  createWalletReputation(reputation: InsertWalletReputation): Promise<WalletReputation>;
  getWalletReputation(address: string): Promise<WalletReputation | undefined>;
  
  // Trust NFT
  createTrustNFT(nft: InsertTrustNFT): Promise<TrustNFT>;
  getTrustNFT(walletAddress: string): Promise<TrustNFT | undefined>;
  updateTrustNFT(walletAddress: string, updates: Partial<TrustNFT>): Promise<TrustNFT | undefined>;
  
  // Protection logs
  createProtectionLog(log: InsertProtectionLog): Promise<ProtectionLog>;
  getProtectionLogs(walletAddress: string): Promise<ProtectionLog[]>;
  
  // Contract registry
  createContractRegistry(entry: InsertContractRegistry): Promise<ContractRegistry>;
  getContractRegistry(): Promise<ContractRegistry[]>;
  getContractRegistryByAddress(address: string): Promise<ContractRegistry | undefined>;
  
  // Daily reports
  createDailyReport(report: InsertDailyReport): Promise<DailyReport>;
  getDailyReport(walletAddress: string, date: string): Promise<DailyReport | undefined>;
  getLatestDailyReport(walletAddress: string): Promise<DailyReport | undefined>;
}

export class MemStorage implements IStorage {
  private websiteScans: Map<string, WebsiteScan>;
  private contractAnalyses: Map<string, ContractAnalysis>;
  private tokenAnalyses: Map<string, TokenAnalysis>;
  private walletReputations: Map<string, WalletReputation>;
  private trustNFTs: Map<string, TrustNFT>;
  private protectionLogs: Map<string, ProtectionLog>;
  private contractRegistry: Map<string, ContractRegistry>;
  private dailyReports: Map<string, DailyReport>;

  constructor() {
    this.websiteScans = new Map();
    this.contractAnalyses = new Map();
    this.tokenAnalyses = new Map();
    this.walletReputations = new Map();
    this.trustNFTs = new Map();
    this.protectionLogs = new Map();
    this.contractRegistry = new Map();
    this.dailyReports = new Map();
    
    this.seedContractRegistry();
  }

  private seedContractRegistry() {
    const entries: ContractRegistry[] = [
      {
        id: randomUUID(),
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
        id: randomUUID(),
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
        id: randomUUID(),
        address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        chain: "polygon",
        name: "DAI Stablecoin",
        status: "safe",
        reportCount: 0,
        verifiedBy: "MakerDAO",
        addedDate: "2023-03-10T00:00:00Z",
        lastUpdated: "2024-09-20T00:00:00Z",
      },
    ];
    
    entries.forEach(entry => {
      this.contractRegistry.set(entry.id, entry);
    });
  }

  // Website scans
  async createWebsiteScan(scan: InsertWebsiteScan): Promise<WebsiteScan> {
    const id = randomUUID();
    const websiteScan: WebsiteScan = { ...scan, id };
    this.websiteScans.set(id, websiteScan);
    return websiteScan;
  }

  async getWebsiteScan(id: string): Promise<WebsiteScan | undefined> {
    return this.websiteScans.get(id);
  }

  async getWebsiteScanByUrl(url: string): Promise<WebsiteScan | undefined> {
    return Array.from(this.websiteScans.values()).find(scan => scan.url === url);
  }

  // Contract analysis
  async createContractAnalysis(analysis: InsertContractAnalysis): Promise<ContractAnalysis> {
    const id = randomUUID();
    const contractAnalysis: ContractAnalysis = { ...analysis, id };
    this.contractAnalyses.set(id, contractAnalysis);
    return contractAnalysis;
  }

  async getContractAnalysis(id: string): Promise<ContractAnalysis | undefined> {
    return this.contractAnalyses.get(id);
  }

  async getContractAnalysisByAddress(address: string): Promise<ContractAnalysis | undefined> {
    return Array.from(this.contractAnalyses.values()).find(
      analysis => analysis.address.toLowerCase() === address.toLowerCase()
    );
  }

  // Token analysis
  async createTokenAnalysis(analysis: InsertTokenAnalysis): Promise<TokenAnalysis> {
    const id = randomUUID();
    const tokenAnalysis: TokenAnalysis = { ...analysis, id };
    this.tokenAnalyses.set(id, tokenAnalysis);
    return tokenAnalysis;
  }

  async getTokenAnalysis(id: string): Promise<TokenAnalysis | undefined> {
    return this.tokenAnalyses.get(id);
  }

  async getTokenAnalysisByAddress(address: string): Promise<TokenAnalysis | undefined> {
    return Array.from(this.tokenAnalyses.values()).find(
      analysis => analysis.address.toLowerCase() === address.toLowerCase()
    );
  }

  // Wallet reputation
  async createWalletReputation(reputation: InsertWalletReputation): Promise<WalletReputation> {
    const id = randomUUID();
    const walletReputation: WalletReputation = { ...reputation, id };
    this.walletReputations.set(reputation.address.toLowerCase(), walletReputation);
    return walletReputation;
  }

  async getWalletReputation(address: string): Promise<WalletReputation | undefined> {
    return this.walletReputations.get(address.toLowerCase());
  }

  // Trust NFT
  async createTrustNFT(nft: InsertTrustNFT): Promise<TrustNFT> {
    const id = randomUUID();
    const trustNFT: TrustNFT = { ...nft, id };
    this.trustNFTs.set(nft.walletAddress.toLowerCase(), trustNFT);
    return trustNFT;
  }

  async getTrustNFT(walletAddress: string): Promise<TrustNFT | undefined> {
    return this.trustNFTs.get(walletAddress.toLowerCase());
  }

  async updateTrustNFT(walletAddress: string, updates: Partial<TrustNFT>): Promise<TrustNFT | undefined> {
    const existing = this.trustNFTs.get(walletAddress.toLowerCase());
    if (!existing) return undefined;
    
    const updated: TrustNFT = { ...existing, ...updates };
    this.trustNFTs.set(walletAddress.toLowerCase(), updated);
    return updated;
  }

  // Protection logs
  async createProtectionLog(log: InsertProtectionLog): Promise<ProtectionLog> {
    const id = randomUUID();
    const protectionLog: ProtectionLog = { ...log, id };
    this.protectionLogs.set(id, protectionLog);
    return protectionLog;
  }

  async getProtectionLogs(walletAddress: string): Promise<ProtectionLog[]> {
    return Array.from(this.protectionLogs.values())
      .filter(log => log.walletAddress.toLowerCase() === walletAddress.toLowerCase())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Contract registry
  async createContractRegistry(entry: InsertContractRegistry): Promise<ContractRegistry> {
    const id = randomUUID();
    const registryEntry: ContractRegistry = { ...entry, id };
    this.contractRegistry.set(id, registryEntry);
    return registryEntry;
  }

  async getContractRegistry(): Promise<ContractRegistry[]> {
    return Array.from(this.contractRegistry.values())
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  }

  async getContractRegistryByAddress(address: string): Promise<ContractRegistry | undefined> {
    return Array.from(this.contractRegistry.values()).find(
      entry => entry.address.toLowerCase() === address.toLowerCase()
    );
  }

  // Daily reports
  async createDailyReport(report: InsertDailyReport): Promise<DailyReport> {
    const id = randomUUID();
    const dailyReport: DailyReport = { ...report, id };
    this.dailyReports.set(`${report.walletAddress.toLowerCase()}_${report.date}`, dailyReport);
    return dailyReport;
  }

  async getDailyReport(walletAddress: string, date: string): Promise<DailyReport | undefined> {
    return this.dailyReports.get(`${walletAddress.toLowerCase()}_${date}`);
  }

  async getLatestDailyReport(walletAddress: string): Promise<DailyReport | undefined> {
    const reports = Array.from(this.dailyReports.values())
      .filter(report => report.walletAddress.toLowerCase() === walletAddress.toLowerCase())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return reports[0];
  }
}

export const storage = new MemStorage();
