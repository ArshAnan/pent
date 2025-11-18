#!/usr/bin/env node

/**
 * Setup verification script
 * Checks if the application is configured correctly
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    log(`✅ ${description}`, colors.green);
    return true;
  } else {
    log(`❌ ${description}`, colors.red);
    return false;
  }
}

function checkEnvVariable(varName, value, description) {
  if (!value || value.includes('your-') || value.includes('here')) {
    log(`❌ ${description}: Not configured`, colors.red);
    return false;
  } else {
    const masked = value.substring(0, 8) + '...';
    log(`✅ ${description}: ${masked}`, colors.green);
    return true;
  }
}

async function main() {
  log('\n🔍 AI Code Security Analyzer - Setup Verification\n', colors.cyan + colors.bright);

  let allGood = true;

  // Check Node version
  log('Checking Node.js version...', colors.blue);
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  if (majorVersion >= 20) {
    log(`✅ Node.js ${nodeVersion} (required: 20+)`, colors.green);
  } else {
    log(`❌ Node.js ${nodeVersion} (required: 20+)`, colors.red);
    allGood = false;
  }

  // Check required files
  log('\nChecking required files...', colors.blue);
  const requiredFiles = [
    ['package.json', 'package.json exists'],
    ['app/page.tsx', 'Main page exists'],
    ['app/api/pentest/route.ts', 'Pentest API exists'],
    ['app/api/suggest-fixes/route.ts', 'Suggest fixes API exists'],
    ['lib/types.ts', 'Type definitions exist'],
    ['lib/vulnerability-checks.ts', 'Vulnerability checks exist'],
  ];

  for (const [file, description] of requiredFiles) {
    if (!checkFile(path.join(process.cwd(), file), description)) {
      allGood = false;
    }
  }

  // Check .env.local
  log('\nChecking environment configuration...', colors.blue);
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    log('❌ .env.local file not found', colors.red);
    log('   Create it by running: cp .env.example .env.local', colors.yellow);
    allGood = false;
  } else {
    log('✅ .env.local file exists', colors.green);

    // Read and check environment variables
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        envVars[match[1].trim()] = match[2].trim();
      }
    });

    // Check each required variable
    if (!checkEnvVariable('DAYTONA_API_KEY', envVars.DAYTONA_API_KEY, 'Daytona API Key')) {
      log('   Get your key at: https://app.daytona.io/dashboard/keys', colors.yellow);
      allGood = false;
    }

    if (!checkEnvVariable('OPENAI_API_KEY', envVars.OPENAI_API_KEY, 'OpenAI API Key')) {
      log('   Get your key at: https://platform.openai.com/api-keys', colors.yellow);
      allGood = false;
    }

    if (envVars.DAYTONA_API_URL) {
      log(`✅ Daytona API URL: ${envVars.DAYTONA_API_URL}`, colors.green);
    }
  }

  // Check dependencies
  log('\nChecking dependencies...', colors.blue);
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    log('❌ node_modules not found', colors.red);
    log('   Run: npm install', colors.yellow);
    allGood = false;
  } else {
    const requiredDeps = [
      ['@daytonaio/sdk', 'Daytona SDK'],
      ['openai', 'OpenAI SDK'],
      ['next', 'Next.js'],
      ['react', 'React'],
      ['zod', 'Zod'],
    ];

    for (const [dep, name] of requiredDeps) {
      const depPath = path.join(nodeModulesPath, dep);
      if (!checkFile(depPath, `${name} installed`)) {
        allGood = false;
      }
    }
  }

  // Summary
  log('\n' + '='.repeat(50), colors.cyan);
  if (allGood) {
    log('\n🎉 Setup verification PASSED!', colors.green + colors.bright);
    log('\nYou\'re ready to run the application:', colors.green);
    log('   npm run dev', colors.cyan);
    log('\nThen open: http://localhost:3000\n', colors.cyan);
  } else {
    log('\n⚠️  Setup verification FAILED', colors.red + colors.bright);
    log('\nPlease fix the issues above and run this script again.', colors.yellow);
    log('For detailed setup instructions, see SETUP.md\n', colors.yellow);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Error running verification:', err);
  process.exit(1);
});

