import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export interface ContractAnalysis {
  riskScore: number;
  threats: string[];
  analysis: string;
  recommendations: string[];
}

export interface TokenAnalysis {
  riskScore: number;
  isHoneypot: boolean;
  liquidityLocked: boolean;
  contractVerified: boolean;
  tradingEnabled: boolean;
  warnings: string[];
}

export interface WebsiteAnalysis {
  riskScore: number;
  isPhishing: boolean;
  threats: string[];
  analysis: string;
}

/**
 * Analyze smart contract code for security risks
 */
export async function analyzeContract(contractCode: string): Promise<ContractAnalysis> {
  try {
    const prompt = `Analyze this smart contract code for security risks. Look for:
- mint() abuse
- drain() functions
- blacklist functions
- unlimited approvals
- centralization risks (owner has too much control)
- hidden backdoors
- rug pull patterns

Contract Code:
\`\`\`
${contractCode}
\`\`\`

Respond in JSON format:
{
  "riskScore": 0-100,
  "threats": ["list of threats"],
  "analysis": "detailed analysis",
  "recommendations": ["list of recommendations"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content || "{}";
    const analysis = JSON.parse(content) as ContractAnalysis;
    
    return analysis;
  } catch (error) {
    console.error("Contract analysis error:", error);
    // Return detailed default analysis if API fails
    return {
      riskScore: 50,
      threats: [
        "AI analysis unavailable - using heuristic checks",
        "Contract source code verification recommended",
        "Manual review suggested before interaction"
      ],
      analysis: "Our AI analysis service is temporarily unavailable. Based on basic checks, this contract requires manual verification. Please review the contract source code, check for verified status, and ensure you understand all functions before interacting. When in doubt, proceed with caution or avoid the interaction entirely.",
      recommendations: [
        "Verify contract source code on block explorer",
        "Check contract owner and recent transactions",
        "Review contract functions for suspicious patterns",
        "Start with small test transactions if proceeding",
        "Consider waiting for AI analysis to be restored"
      ],
    };
  }
}

/**
 * Analyze token for scam patterns
 */
export async function analyzeToken(
  contractAddress: string,
  metadata: any
): Promise<TokenAnalysis> {
  try {
    const prompt = `Analyze this token for scam patterns:
- Contract Address: ${contractAddress}
- Metadata: ${JSON.stringify(metadata)}

Check for:
- Honeypot behavior
- Liquidity locked status
- Contract verification
- Trading enabled/disabled
- Massive supply mintable
- LP burn status

Respond in JSON format:
{
  "riskScore": 0-100,
  "isHoneypot": boolean,
  "liquidityLocked": boolean,
  "contractVerified": boolean,
  "tradingEnabled": boolean,
  "warnings": ["list of warnings"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content || "{}";
    const analysis = JSON.parse(content) as TokenAnalysis;
    
    return analysis;
  } catch (error) {
    console.error("Token analysis error:", error);
    return {
      riskScore: 50,
      isHoneypot: false,
      liquidityLocked: false,
      contractVerified: false,
      tradingEnabled: true,
      warnings: [
        "AI analysis unavailable - using basic checks",
        "Token requires manual verification",
        "Check liquidity lock status manually",
        "Verify ownership renouncement status",
        "Review tokenomics before trading"
      ],
    };
  }
}

/**
 * Analyze website for phishing patterns
 */
export async function analyzeWebsite(url: string, htmlContent?: string): Promise<WebsiteAnalysis> {
  try {
    const prompt = `Analyze this website URL for phishing patterns:
- URL: ${url}
${htmlContent ? `- HTML Content (first 2000 chars): ${htmlContent.substring(0, 2000)}` : ""}

Check for:
- Fake Uniswap clones
- Fake airdrop pages
- Fake MetaMask pages
- Fake staking dashboards
- Suspicious domain patterns
- Known phishing indicators

Respond in JSON format:
{
  "riskScore": 0-100,
  "isPhishing": boolean,
  "threats": ["list of threats"],
  "analysis": "detailed analysis"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content || "{}";
    const analysis = JSON.parse(content) as WebsiteAnalysis;
    
    return analysis;
  } catch (error) {
    console.error("Website analysis error:", error);
    return {
      riskScore: 50,
      isPhishing: false,
      threats: [
        "AI analysis unavailable - using pattern detection",
        "Website requires manual verification",
        "Check URL carefully for typosquatting",
        "Verify SSL certificate validity",
        "Review website content manually"
      ],
      analysis: "Our AI analysis service is temporarily unavailable. Based on basic pattern checks, this website requires manual verification. Please check the URL carefully for typosquatting (fake domains that look similar to legitimate ones), verify the SSL certificate, and review the website content before entering any sensitive information or connecting your wallet.",
    };
  }
}

/**
 * Simulate transaction to check for risks
 */
export async function simulateTransaction(
  from: string,
  to: string,
  data: string
): Promise<{ safe: boolean; riskScore: number; warnings: string[] }> {
  try {
    const prompt = `Simulate this transaction:
- From: ${from}
- To: ${to}
- Data: ${data}

Check if:
- User will lose tokens
- Tokens will be stolen
- Approvals will be unlimited
- Transaction is safe

Respond in JSON format:
{
  "safe": boolean,
  "riskScore": 0-100,
  "warnings": ["list of warnings"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content || "{}";
    const result = JSON.parse(content);
    
    return result;
  } catch (error) {
    console.error("Transaction simulation error:", error);
    return {
      safe: false,
      riskScore: 50,
      warnings: [
        "AI simulation unavailable - cannot verify transaction safety",
        "Manual review required before execution",
        "Check contract functions and permissions carefully",
        "Verify token amounts and recipient addresses",
        "Start with small test transaction if proceeding",
        "Consider waiting for AI analysis to be restored"
      ],
      analysis: "Our AI transaction simulation service is temporarily unavailable. We cannot verify the safety of this transaction automatically. Please manually review all transaction details including the recipient address, token amounts, contract functions being called, and gas limits. When in doubt, do not proceed with the transaction.",
    };
  }
}

