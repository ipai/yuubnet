#!/usr/bin/env node

import { writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Default to localhost if not in Cloudflare Pages
const baseUrl = process.env.CF_PAGES_URL || 'http://localhost:3000';

// Generate the env content
const envContent = `# Generated during build
BASE_URL=${baseUrl}
`;

// Write to .env file
const envPath = join(dirname(__dirname), '.env');
await writeFile(envPath, envContent, 'utf8');
console.log(`Generated .env with BASE_URL=${baseUrl}`);
