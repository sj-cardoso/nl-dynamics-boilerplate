/**
 * novalogica Dynamics 365 OAuth Token Manager
 *
 * This script handles automatic OAuth authentication for Dynamics 365:
 * - Validates existing tokens and refreshes when needed
 * - Opens browser for OAuth flow using Puppeteer
 * - Extracts and stores access tokens securely
 * - Updates .env file with token data automatically
 *
 * Usage: npm start (runs automatically) or node getToken.js
 */

const puppeteer = require("puppeteer");
const fs = require("fs");
const readline = require("readline");
require("dotenv").config();

// ==========================================
// CONFIGURATION
// ==========================================

const CONFIG = {
  AUTH_URL: process.env.AUTH_URL,
  CALLBACK_URL: process.env.CALLBACK_URL,
  SCOPE: process.env.SCOPE || "",
  EXPIRY_MARGIN: 60, // seconds before expiration to refresh token
  BROWSER_TIMEOUT: 300000, // 5 minutes timeout for authentication
};

// ==========================================
// CONSOLE UTILITIES
// ==========================================

const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  warning: (msg) => console.log(`⚠️  ${msg}`),
  key: (msg) => console.log(`🔑 ${msg}`),
  loading: (msg) => console.log(`🔄 ${msg}`),
  header: () => {
    console.log("🚀 novalogica Dynamics 365 Token Manager");
    console.log("=====================================");
  },
};

// ==========================================
// TOKEN VALIDATION
// ==========================================

/**
 * Checks if the current stored token is still valid
 * @returns {boolean} True if token is valid and not expired
 */
function isTokenValid() {
  const { REACT_APP_D365_TOKEN, EXPIRES_IN, TOKEN_TIMESTAMP } = process.env;

  // Check if all required token data exists
  if (!REACT_APP_D365_TOKEN || !EXPIRES_IN || !TOKEN_TIMESTAMP) {
    log.warning("No valid token found in .env file");
    return false;
  }

  // Calculate if token is still valid (with margin for safety)
  const currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = parseInt(TOKEN_TIMESTAMP) + parseInt(EXPIRES_IN) - CONFIG.EXPIRY_MARGIN;
  const isValid = currentTime < expirationTime;

  if (isValid) {
    const remainingMinutes = Math.floor((expirationTime - currentTime) / 60);
    log.info(`Token is still valid (${remainingMinutes} minutes remaining)`);
  } else {
    log.warning("Token has expired and needs renewal");
  }

  return isValid;
}

// ==========================================
// ENVIRONMENT MANAGEMENT
// ==========================================

/**
 * Updates .env file with new key-value pairs
 * Preserves existing values and adds new ones
 * @param {Object} updates - Key-value pairs to update
 */
function updateEnvFile(updates) {
  const envPath = ".env";
  let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";

  // Update each key-value pair
  Object.entries(updates).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*`, "m");
    const newLine = `${key}=${value}`;

    if (envContent.match(regex)) {
      envContent = envContent.replace(regex, newLine);
    } else {
      envContent += `\n${newLine}`;
    }
  });

  // Write back to file with clean formatting
  fs.writeFileSync(envPath, envContent.trim() + "\n");
}

/**
 * Prompts user for input with readline interface
 * @param {string} query - Question to ask the user
 * @returns {Promise<string>} User's input
 */
function promptUser(query) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// ==========================================
// CLIENT ID MANAGEMENT
// ==========================================

/**
 * Gets CLIENT_ID from environment or prompts user to enter it
 * Saves the CLIENT_ID to .env file for future use
 * @returns {Promise<string>} The CLIENT_ID
 */
async function ensureClientId() {
  let clientId = process.env.CLIENT_ID;

  if (!clientId) {
    log.key("CLIENT_ID not found in environment variables");
    log.info("You can find your CLIENT_ID in Azure Portal > App Registrations");

    clientId = await promptUser("Please enter your Azure App Registration Client ID: ");

    if (!clientId) {
      throw new Error("CLIENT_ID is required for OAuth authentication");
    }

    updateEnvFile({ CLIENT_ID: clientId });
    log.success("CLIENT_ID saved to .env file for future use");
  }

  return clientId;
}

// ==========================================
// OAUTH URL GENERATION
// ==========================================

/**
 * Builds the complete OAuth authorization URL
 * @param {string} clientId - Azure App Registration Client ID
 * @returns {string} Complete OAuth URL
 */
function buildAuthUrl(clientId) {
  const url = new URL(CONFIG.AUTH_URL);

  // Set required OAuth parameters
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", CONFIG.CALLBACK_URL);
  url.searchParams.set("response_type", "token"); // Implicit flow
  url.searchParams.set("scope", CONFIG.SCOPE);

  return url.toString();
}

// ==========================================
// TOKEN EXTRACTION
// ==========================================

/**
 * Extracts access token and expiration from OAuth callback URL
 * @param {string} url - Callback URL containing token data
 * @returns {Object} Token data with access_token and expires_in
 */
function extractTokenFromUrl(url) {
  const tokenMatch = url.match(/access_token=([^&]+)/);
  const expiresMatch = url.match(/expires_in=([^&]+)/);

  return {
    token: tokenMatch ? decodeURIComponent(tokenMatch[1]) : null,
    expiresIn: expiresMatch ? parseInt(expiresMatch[1], 10) : null,
  };
}

// ==========================================
// BROWSER AUTHENTICATION
// ==========================================

/**
 * Opens browser and handles OAuth authentication flow
 * Uses Puppeteer to automate the browser interaction
 * @param {string} authUrl - Complete OAuth authorization URL
 * @returns {Promise<Object>} Token data from OAuth callback
 */
async function performBrowserAuth(authUrl) {
  log.loading("Opening browser for OAuth authentication...");
  log.info("Please complete the sign-in process in the browser window");

  const browser = await puppeteer.launch({
    headless: false, // Show browser for user interaction
    defaultViewport: null, // Use full viewport
    args: ["--start-maximized"], // Start maximized for better UX
  });

  const page = await browser.newPage();

  try {
    // Set up promise to detect OAuth callback
    const tokenPromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Authentication timeout - please try again"));
      }, CONFIG.BROWSER_TIMEOUT);

      // Listen for the callback URL containing the token
      page.on("request", (request) => {
        const reqUrl = request.url();

        if (reqUrl.startsWith(CONFIG.CALLBACK_URL)) {
          clearTimeout(timeout);
          log.success("OAuth callback detected - extracting token");

          const { token, expiresIn } = extractTokenFromUrl(reqUrl);

          if (token && expiresIn) {
            resolve({ token, expiresIn });
          } else {
            reject(new Error("Failed to extract token from OAuth callback"));
          }
        }
      });
    });

    // Navigate to OAuth authorization URL
    await page.goto(authUrl, { waitUntil: "networkidle2" });

    // Wait for user authentication and token extraction
    const tokenData = await tokenPromise;

    return tokenData;
  } finally {
    await browser.close();
  }
}

// ==========================================
// MAIN AUTHENTICATION FLOW
// ==========================================

/**
 * Complete OAuth authentication process
 * Handles the entire flow from client ID to token storage
 */
async function authenticateUser() {
  try {
    // Ensure we have a valid CLIENT_ID
    const clientId = await ensureClientId();

    // Build OAuth authorization URL
    const authUrl = buildAuthUrl(clientId);

    // Perform browser-based authentication
    const { token, expiresIn } = await performBrowserAuth(authUrl);

    // Store token data in environment
    const timestamp = Math.floor(Date.now() / 1000);
    updateEnvFile({
      REACT_APP_D365_TOKEN: token,
      EXPIRES_IN: expiresIn.toString(),
      TOKEN_TIMESTAMP: timestamp.toString(),
    });

    // Success feedback
    const expiryMinutes = Math.floor(expiresIn / 60);
    log.success(`✨ Authentication successful!`);
    log.success(`🕒 Token expires in ${expiryMinutes} minutes`);
    log.success(`💾 Token securely saved to .env file`);
  } catch (error) {
    log.error(`Authentication failed: ${error.message}`);
    log.info("💡 Troubleshooting tips:");
    log.info("   • Verify your CLIENT_ID is correct");
    log.info("   • Check your Azure App Registration permissions");
    log.info("   • Ensure your D365 environment URL is correct");
    process.exit(1);
  }
}

// ==========================================
// MAIN EXECUTION
// ==========================================

/**
 * Main entry point - orchestrates the entire token management process
 */
(async () => {
  try {
    log.header();

    // Check if we already have a valid token
    if (isTokenValid()) {
      log.success("✨ Current token is still valid - no action needed");
      log.info("🚀 You can now run your application!");
      return;
    }

    // Perform OAuth authentication to get new token
    log.info("🔐 Starting OAuth authentication process...");
    await authenticateUser();

    log.success("🎉 Token management completed successfully!");
    log.info("🚀 You can now run your application with: npm start");
  } catch (error) {
    log.error(`❌ Fatal error: ${error.message}`);
    process.exit(1);
  }
})();
