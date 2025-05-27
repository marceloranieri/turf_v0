import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Load all possible .env files
const envFiles = ['.env', '.env.local', '.env.development', '.env.production'];
const envVars: { [key: string]: { [key: string]: string } } = {};

// Function to safely read file
const safeReadFile = (filePath: string): string | null => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return null;
  }
};

// Read local env files
envFiles.forEach(file => {
  const content = safeReadFile(path.join(process.cwd(), file));
  if (content) {
    const envConfig = config({ path: file });
    if (envConfig.parsed) {
      envVars[file] = envConfig.parsed;
    }
  }
});

// Validate environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Function to check Vercel env vars
const checkVercelEnv = async () => {
  try {
    const vercelEnv = execSync('vercel env ls').toString();
    const lines = vercelEnv.split('\n').filter(line => line.trim());
    envVars['vercel'] = {};
    
    lines.forEach(line => {
      const match = line.match(/([A-Z_]+)\s+([A-Za-z]+)\s+([^ ]+)/);
      if (match) {
        const [_, key, type, value] = match;
        envVars['vercel'][key] = value;
      }
    });
  } catch (error) {
    console.log('Vercel CLI not available or not logged in');
  }
};

// Function to check GitHub secrets
const checkGithubSecrets = async () => {
  try {
    const githubSecrets = execSync('gh secret list --json name,value').toString();
    const parsed = JSON.parse(githubSecrets);
    envVars['github'] = parsed.reduce((acc: any, curr: any) => {
      acc[curr.name] = curr.value;
      return acc;
    }, {});
  } catch (error) {
    console.log('GitHub CLI not available or not logged in');
  }
};

// Function to check Supabase env vars
const checkSupabaseEnv = async () => {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    // Note: This is a basic check. You might want to add more specific checks
    // based on your Supabase project settings
    envVars['supabase'] = {
      'SUPABASE_URL': supabaseUrl,
      'SUPABASE_ANON_KEY': supabaseKey,
    };
  } catch (error) {
    console.log('Error checking Supabase environment');
  }
};

// Main function to run all checks
const main = async () => {
  console.log('🔍 Checking environment variables across different platforms...\n');

  await checkVercelEnv();
  await checkGithubSecrets();
  await checkSupabaseEnv();

  // Get all unique keys
  const allKeys = new Set<string>();
  Object.values(envVars).forEach(env => {
    Object.keys(env).forEach(key => allKeys.add(key));
  });

  // Create comparison table
  console.log('Environment Variables Comparison:');
  console.log('================================\n');

  const sources = Object.keys(envVars);
  const table: { [key: string]: { [key: string]: string } } = {};

  allKeys.forEach(key => {
    table[key] = {};
    sources.forEach(source => {
      table[key][source] = envVars[source]?.[key] ? '✅' : '❌';
    });
  });

  // Print table
  console.log('Key'.padEnd(40) + sources.map(s => s.padEnd(15)).join(''));
  console.log('-'.repeat(40 + sources.length * 15));

  Object.entries(table).forEach(([key, values]) => {
    const row = key.padEnd(40) + sources.map(s => values[s].padEnd(15)).join('');
    console.log(row);
  });

  // Print warnings for missing variables
  console.log('\n⚠️  Warnings:');
  console.log('============\n');
  
  sources.forEach(source => {
    const missingVars = Object.entries(table)
      .filter(([_, values]) => values[source] === '❌')
      .map(([key]) => key);
    
    if (missingVars.length > 0) {
      console.log(`Missing variables in ${source}:`);
      missingVars.forEach(key => console.log(`  - ${key}`));
      console.log('');
    }
  });
};

main().catch(console.error);
