// Quick script to check if .env is configured correctly
require("dotenv").config();

console.log("🔍 Checking environment configuration...\n");

const checks = {
  PRIVATE_KEY: {
    value: process.env.PRIVATE_KEY,
    required: true,
    validator: (val) => {
      if (!val) return { valid: false, error: "Missing" };
      let key = val.trim();
      // Remove 0x prefix if present
      if (key.startsWith('0x') || key.startsWith('0X')) {
        key = key.slice(2);
      }
      if (key.length !== 64) return { valid: false, error: `Invalid length: ${key.length} (expected 64 hex characters)` };
      if (!/^[0-9a-fA-F]+$/.test(key)) return { valid: false, error: "Contains invalid characters (must be hex)" };
      return { valid: true };
    }
  },
  POLYGON_AMOY_RPC_URL: {
    value: process.env.POLYGON_AMOY_RPC_URL,
    required: false,
    validator: (val) => ({ valid: true })
  },
  OPENAI_API_KEY: {
    value: process.env.OPENAI_API_KEY,
    required: false,
    validator: (val) => ({ valid: true })
  },
};

let allValid = true;

for (const [key, check] of Object.entries(checks)) {
  const result = check.validator(check.value);
  const status = result.valid ? "✅" : "❌";
  let display = check.value || "Not set";
  
  if (check.value && key === "PRIVATE_KEY") {
    const keyVal = check.value.trim();
    const cleanKey = keyVal.startsWith('0x') ? keyVal.slice(2) : keyVal;
    display = `${cleanKey.substring(0, 6)}...${cleanKey.substring(cleanKey.length - 4)} (${cleanKey.length} chars)`;
  } else if (check.value && key === "OPENAI_API_KEY") {
    display = check.value.substring(0, 10) + "...";
  }
  
  console.log(`${status} ${key}: ${display}`);
  if (!result.valid) {
    console.log(`   Error: ${result.error}`);
    if (check.required) allValid = false;
  }
}

console.log("\n" + "=".repeat(50));

if (allValid) {
  console.log("✅ All required environment variables are valid!");
  console.log("\nYou can now run: npm run deploy:amoy");
} else {
  console.log("❌ Some required environment variables are invalid.");
  console.log("\n📝 How to fix PRIVATE_KEY:");
  console.log("1. Open your .env file");
  console.log("2. Make sure PRIVATE_KEY is exactly 64 hex characters");
  console.log("3. It can have '0x' prefix or not - both work");
  console.log("4. Example: PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef");
  console.log("5. Or: PRIVATE_KEY=1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef");
  console.log("\n⚠️  Make sure there are no extra spaces or quotes around the key!");
}

