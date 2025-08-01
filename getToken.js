/**
 * Dynamics 365 OAuth Token Manager
 * Handles automatic OAuth authentication, token validation, and renewal
 * Usage: node getToken.js
 */

const puppeteer = require("puppeteer");
const fs = require("fs");
const readline = require("readline");
require("dotenv").config();

const CONFIG = {
  AUTH_URL: process.env.AUTH_URL,
  CALLBACK_URL: process.env.CALLBACK_URL,
  SCOPE: process.env.SCOPE || "",
  EXPIRY_MARGIN: 60,
  BROWSER_TIMEOUT: 300000,
};

function isTokenValid() {
  const { REACT_APP_D365_TOKEN, EXPIRES_IN, TOKEN_TIMESTAMP } = process.env;

  if (!REACT_APP_D365_TOKEN || !EXPIRES_IN || !TOKEN_TIMESTAMP) {
    console.log("⚠️  No valid token found");
    return false;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = parseInt(TOKEN_TIMESTAMP) + parseInt(EXPIRES_IN) - CONFIG.EXPIRY_MARGIN;
  const isValid = currentTime < expirationTime;

  if (isValid) {
    const remainingMinutes = Math.floor((expirationTime - currentTime) / 60);
    console.log(`ℹ️  Token valid (${remainingMinutes} minutes remaining)`);
  } else {
    console.log("⚠️  Token expired - renewal needed");
  }

  return isValid;
}

function updateEnvFile(updates) {
  const envPath = ".env";
  let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";

  Object.entries(updates).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*`, "m");
    const newLine = `${key}=${value}`;

    envContent = envContent.match(regex)
      ? envContent.replace(regex, newLine)
      : envContent + `\n${newLine}`;
  });

  fs.writeFileSync(envPath, envContent.trim() + "\n");
}

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

async function ensureClientId() {
  let clientId = process.env.CLIENT_ID;

  if (!clientId) {
    console.log("🔑 CLIENT_ID required - find it in Azure Portal > App Registrations");
    clientId = await promptUser("Enter your Azure App Registration Client ID: ");

    if (!clientId) {
      throw new Error("CLIENT_ID is required for OAuth authentication");
    }

    updateEnvFile({ CLIENT_ID: clientId });
    console.log("✅ CLIENT_ID saved to .env file");
  }

  return clientId;
}

function buildAuthUrl(clientId) {
  const url = new URL(CONFIG.AUTH_URL);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", CONFIG.CALLBACK_URL);
  url.searchParams.set("response_type", "token");
  url.searchParams.set("scope", CONFIG.SCOPE);
  return url.toString();
}

function extractTokenFromUrl(url) {
  const tokenMatch = url.match(/access_token=([^&]+)/);
  const expiresMatch = url.match(/expires_in=([^&]+)/);

  return {
    token: tokenMatch ? decodeURIComponent(tokenMatch[1]) : null,
    expiresIn: expiresMatch ? parseInt(expiresMatch[1], 10) : null,
  };
}

async function performBrowserAuth(authUrl) {
  console.log("🔄 Opening browser for OAuth authentication...");
  console.log("ℹ️  Complete the sign-in process in the browser");

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const [page] = await browser.pages();

  try {
    const tokenPromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Authentication timeout"));
      }, CONFIG.BROWSER_TIMEOUT);

      page.on("request", (request) => {
        const reqUrl = request.url();

        if (reqUrl.startsWith(CONFIG.CALLBACK_URL)) {
          clearTimeout(timeout);
          console.log("✅ OAuth callback detected");

          const { token, expiresIn } = extractTokenFromUrl(reqUrl);

          if (token && expiresIn) {
            resolve({ token, expiresIn });
          } else {
            reject(new Error("Failed to extract token from callback"));
          }
        }
      });
    });

    await page.goto(authUrl, { waitUntil: "networkidle2" });
    return await tokenPromise;
  } finally {
    await browser.close();
  }
}

async function authenticateUser() {
  const clientId = await ensureClientId();
  const authUrl = buildAuthUrl(clientId);
  const { token, expiresIn } = await performBrowserAuth(authUrl);

  const timestamp = Math.floor(Date.now() / 1000);
  updateEnvFile({
    REACT_APP_D365_TOKEN: token,
    EXPIRES_IN: expiresIn.toString(),
    TOKEN_TIMESTAMP: timestamp.toString(),
  });

  const expiryMinutes = Math.floor(expiresIn / 60);
  console.log("✅ Authentication successful!");
  console.log(`🕒 Token expires in ${expiryMinutes} minutes`);
  console.log("💾 Token saved to .env file");
}

(async () => {
  try {
    console.log("🚀 Dynamics 365 Token Manager\n");

    if (isTokenValid()) {
      console.log("✅ Current token is valid - no action needed");
      console.log("🚀 Run your application with: npm start");
      return;
    }

    console.log("🔐 Starting OAuth authentication...");
    await authenticateUser();
    console.log("🎉 Token management completed!");
    console.log("🚀 Run your application with: npm start");
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    console.log("💡 Check your CLIENT_ID and Azure App Registration settings");
    process.exit(1);
  }
})();
