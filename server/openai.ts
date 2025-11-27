import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export interface WebsiteThreatAnalysis {
  riskScore: number;
  riskLevel: "safe" | "warning" | "danger";
  threats: Array<{
    type: string;
    severity: "low" | "medium" | "high" | "critical";
    description: string;
  }>;
  isBlocked: boolean;
}

export interface ContractRiskAnalysis {
  riskScore: number;
  riskLevel: "safe" | "warning" | "danger";
  isVerified: boolean;
  hasProxyPattern: boolean;
  hasOwnerPrivileges: boolean;
  hasMintFunction: boolean;
  hasPauseFunction: boolean;
  hasBlacklistFunction: boolean;
  honeypotRisk: boolean;
  rugPullRisk: boolean;
  issues: Array<{
    type: string;
    severity: "low" | "medium" | "high" | "critical";
    description: string;
  }>;
}

export interface TokenRiskAnalysis {
  riskScore: number;
  riskLevel: "safe" | "warning" | "danger";
  name: string;
  symbol: string;
  liquidityLocked: boolean;
  liquidityAmount: string;
  lockDuration: string;
  ownershipRenounced: boolean;
  buyTax: number;
  sellTax: number;
  maxTxLimit: boolean;
  maxWalletLimit: boolean;
  canMint: boolean;
  canPause: boolean;
  canBlacklist: boolean;
  isHoneypot: boolean;
  topHoldersConcentration: number;
}

export async function analyzeWebsiteUrl(url: string): Promise<WebsiteThreatAnalysis> {
  try {
    const domain = new URL(url).hostname;
    
    // If OpenAI is not available, use heuristic analysis
    if (!openai) {
      return performHeuristicWebsiteAnalysis(url, domain);
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are a cybersecurity expert specializing in detecting crypto phishing and scam websites.
Analyze the given URL and domain for potential threats. Consider:
- Domain reputation and age
- Typosquatting patterns
- Known phishing patterns
- Suspicious keywords in URL
- Common crypto scam indicators

Respond with JSON in this exact format:
{
  "riskScore": number (0-100, higher is safer),
  "riskLevel": "safe" | "warning" | "danger",
  "threats": [
    {
      "type": "phishing" | "malicious_script" | "fake_ui" | "suspicious_domain" | "typosquatting",
      "severity": "low" | "medium" | "high" | "critical",
      "description": "string"
    }
  ],
  "isBlocked": boolean
}`
        },
        {
          role: "user",
          content: `Analyze this URL for security threats: ${url}\nDomain: ${domain}`
        }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1024,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      riskScore: Math.max(0, Math.min(100, result.riskScore || 50)),
      riskLevel: result.riskLevel || "warning",
      threats: result.threats || [],
      isBlocked: result.isBlocked || false,
    };
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    // Return a default response if API fails
    return {
      riskScore: 50,
      riskLevel: "warning",
      threats: [{
        type: "suspicious_domain",
        severity: "medium",
        description: "Unable to perform full analysis. Proceed with caution."
      }],
      isBlocked: false,
    };
  }
}

export async function analyzeSmartContract(address: string, chain: string): Promise<ContractRiskAnalysis> {
  try {
    // If OpenAI is not available, use heuristic analysis
    if (!openai) {
      return performHeuristicContractAnalysis(address, chain);
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are a smart contract security auditor. Analyze the given contract address for potential risks.
Consider common smart contract vulnerabilities:
- Honeypot patterns (can buy but not sell)
- Rug pull risks (owner can drain funds)
- Unlimited minting functions
- Blacklist/pause functions
- Proxy pattern risks
- Owner privilege abuse

Respond with JSON in this exact format:
{
  "riskScore": number (0-100, higher is safer),
  "riskLevel": "safe" | "warning" | "danger",
  "isVerified": boolean,
  "hasProxyPattern": boolean,
  "hasOwnerPrivileges": boolean,
  "hasMintFunction": boolean,
  "hasPauseFunction": boolean,
  "hasBlacklistFunction": boolean,
  "honeypotRisk": boolean,
  "rugPullRisk": boolean,
  "issues": [
    {
      "type": "string",
      "severity": "low" | "medium" | "high" | "critical",
      "description": "string"
    }
  ]
}`
        },
        {
          role: "user",
          content: `Analyze this smart contract for security risks:\nAddress: ${address}\nChain: ${chain}`
        }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1024,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      riskScore: Math.max(0, Math.min(100, result.riskScore || 50)),
      riskLevel: result.riskLevel || "warning",
      isVerified: result.isVerified ?? false,
      hasProxyPattern: result.hasProxyPattern ?? false,
      hasOwnerPrivileges: result.hasOwnerPrivileges ?? true,
      hasMintFunction: result.hasMintFunction ?? false,
      hasPauseFunction: result.hasPauseFunction ?? false,
      hasBlacklistFunction: result.hasBlacklistFunction ?? false,
      honeypotRisk: result.honeypotRisk ?? false,
      rugPullRisk: result.rugPullRisk ?? false,
      issues: result.issues || [],
    };
  } catch (error) {
    console.error("Contract analysis error:", error);
    return {
      riskScore: 50,
      riskLevel: "warning",
      isVerified: false,
      hasProxyPattern: false,
      hasOwnerPrivileges: true,
      hasMintFunction: false,
      hasPauseFunction: false,
      hasBlacklistFunction: false,
      honeypotRisk: false,
      rugPullRisk: false,
      issues: [{
        type: "analysis_error",
        severity: "medium",
        description: "Unable to perform full analysis. Contract may need manual review."
      }],
    };
  }
}

export async function analyzeToken(address: string, chain: string): Promise<TokenRiskAnalysis> {
  try {
    // If OpenAI is not available, use heuristic analysis
    if (!openai) {
      return performHeuristicTokenAnalysis(address, chain);
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are a token security analyst. Analyze the given token contract for safety concerns.
Consider:
- Liquidity lock status
- Ownership renouncement
- Buy/sell taxes
- Max transaction limits
- Honeypot risks
- Top holder concentration

Respond with JSON in this exact format:
{
  "riskScore": number (0-100, higher is safer),
  "riskLevel": "safe" | "warning" | "danger",
  "name": "string",
  "symbol": "string",
  "liquidityLocked": boolean,
  "liquidityAmount": "string",
  "lockDuration": "string",
  "ownershipRenounced": boolean,
  "buyTax": number (percentage),
  "sellTax": number (percentage),
  "maxTxLimit": boolean,
  "maxWalletLimit": boolean,
  "canMint": boolean,
  "canPause": boolean,
  "canBlacklist": boolean,
  "isHoneypot": boolean,
  "topHoldersConcentration": number (percentage of top 10 holders)
}`
        },
        {
          role: "user",
          content: `Analyze this token for safety:\nAddress: ${address}\nChain: ${chain}`
        }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1024,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      riskScore: Math.max(0, Math.min(100, result.riskScore || 50)),
      riskLevel: result.riskLevel || "warning",
      name: result.name || "Unknown Token",
      symbol: result.symbol || "???",
      liquidityLocked: result.liquidityLocked ?? false,
      liquidityAmount: result.liquidityAmount || "Unknown",
      lockDuration: result.lockDuration || "Unknown",
      ownershipRenounced: result.ownershipRenounced ?? false,
      buyTax: result.buyTax ?? 0,
      sellTax: result.sellTax ?? 0,
      maxTxLimit: result.maxTxLimit ?? false,
      maxWalletLimit: result.maxWalletLimit ?? false,
      canMint: result.canMint ?? false,
      canPause: result.canPause ?? false,
      canBlacklist: result.canBlacklist ?? false,
      isHoneypot: result.isHoneypot ?? false,
      topHoldersConcentration: result.topHoldersConcentration ?? 50,
    };
  } catch (error) {
    console.error("Token analysis error:", error);
    return {
      riskScore: 50,
      riskLevel: "warning",
      name: "Unknown Token",
      symbol: "???",
      liquidityLocked: false,
      liquidityAmount: "Unknown",
      lockDuration: "Unknown",
      ownershipRenounced: false,
      buyTax: 0,
      sellTax: 0,
      maxTxLimit: false,
      maxWalletLimit: false,
      canMint: false,
      canPause: false,
      canBlacklist: false,
      isHoneypot: false,
      topHoldersConcentration: 50,
    };
  }
}

// Heuristic analysis functions for when OpenAI is not available
function performHeuristicWebsiteAnalysis(url: string, domain: string): WebsiteThreatAnalysis {
  const threats: WebsiteThreatAnalysis["threats"] = [];
  let riskScore = 75;

  // Check for suspicious patterns in URL
  const suspiciousPatterns = [
    /airdrop/i,
    /claim/i,
    /free.*token/i,
    /metamask.*unlock/i,
    /wallet.*connect/i,
    /urgent/i,
    /limited.*time/i,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url) || pattern.test(domain)) {
      riskScore -= 15;
      threats.push({
        type: "suspicious_domain",
        severity: "medium",
        description: `Suspicious pattern detected: ${pattern.source}`,
      });
    }
  }

  // Check for typosquatting of known domains
  const knownDomains = ["metamask", "uniswap", "opensea", "aave", "compound"];
  for (const known of knownDomains) {
    if (domain.includes(known) && !domain.includes(`${known}.io`) && !domain.includes(`${known}.com`)) {
      riskScore -= 25;
      threats.push({
        type: "typosquatting",
        severity: "high",
        description: `Possible typosquatting of ${known}`,
      });
    }
  }

  // Check for non-HTTPS
  if (!url.startsWith("https://")) {
    riskScore -= 10;
    threats.push({
      type: "suspicious_domain",
      severity: "medium",
      description: "Website does not use HTTPS encryption",
    });
  }

  // Determine risk level
  const riskLevel: "safe" | "warning" | "danger" = 
    riskScore >= 71 ? "safe" : riskScore >= 41 ? "warning" : "danger";

  return {
    riskScore: Math.max(0, Math.min(100, riskScore)),
    riskLevel,
    threats,
    isBlocked: riskLevel === "danger",
  };
}

function performHeuristicContractAnalysis(address: string, chain: string): ContractRiskAnalysis {
  // Known safe contracts
  const knownSafeContracts = [
    "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0", // MATIC
    "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", // USDC
    "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063", // DAI
  ];

  if (knownSafeContracts.includes(address.toLowerCase())) {
    return {
      riskScore: 95,
      riskLevel: "safe",
      isVerified: true,
      hasProxyPattern: false,
      hasOwnerPrivileges: false,
      hasMintFunction: false,
      hasPauseFunction: false,
      hasBlacklistFunction: false,
      honeypotRisk: false,
      rugPullRisk: false,
      issues: [],
    };
  }

  // Default analysis for unknown contracts
  return {
    riskScore: 55,
    riskLevel: "warning",
    isVerified: false,
    hasProxyPattern: false,
    hasOwnerPrivileges: true,
    hasMintFunction: false,
    hasPauseFunction: false,
    hasBlacklistFunction: false,
    honeypotRisk: false,
    rugPullRisk: false,
    issues: [{
      type: "unverified_contract",
      severity: "medium",
      description: "Contract source code is not verified. Full analysis requires AI or manual review.",
    }],
  };
}

function performHeuristicTokenAnalysis(address: string, chain: string): TokenRiskAnalysis {
  // Known safe tokens
  const knownTokens: Record<string, { name: string; symbol: string; riskScore: number }> = {
    "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0": { name: "Polygon", symbol: "MATIC", riskScore: 95 },
    "0x2791bca1f2de4661ed88a30c99a7a9449aa84174": { name: "USD Coin", symbol: "USDC", riskScore: 98 },
    "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063": { name: "DAI Stablecoin", symbol: "DAI", riskScore: 97 },
  };

  const known = knownTokens[address.toLowerCase()];
  if (known) {
    return {
      riskScore: known.riskScore,
      riskLevel: "safe",
      name: known.name,
      symbol: known.symbol,
      liquidityLocked: true,
      liquidityAmount: "High",
      lockDuration: "Permanent",
      ownershipRenounced: true,
      buyTax: 0,
      sellTax: 0,
      maxTxLimit: false,
      maxWalletLimit: false,
      canMint: false,
      canPause: false,
      canBlacklist: false,
      isHoneypot: false,
      topHoldersConcentration: 25,
    };
  }

  // Default analysis for unknown tokens
  return {
    riskScore: 50,
    riskLevel: "warning",
    name: "Unknown Token",
    symbol: "???",
    liquidityLocked: false,
    liquidityAmount: "Unknown",
    lockDuration: "Unknown",
    ownershipRenounced: false,
    buyTax: 0,
    sellTax: 0,
    maxTxLimit: false,
    maxWalletLimit: false,
    canMint: false,
    canPause: false,
    canBlacklist: false,
    isHoneypot: false,
    topHoldersConcentration: 50,
  };
}
