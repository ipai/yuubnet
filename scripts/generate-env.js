#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Default to localhost if not in Cloudflare Pages
const baseUrl = process.env.CF_PAGES_URL || 'http://localhost:3000';

// Generate the env content
const envContent = `# Generated during build
BASE_URL=${baseUrl}
`;

// Write to .env file
fs.writeFileSync(path.join(process.cwd(), '.env'), envContent);
console.log(`Generated .env with BASE_URL=${baseUrl}`);
