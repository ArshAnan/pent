#!/usr/bin/env node

/**
 * Daytona Integration Test Script
 * Tests the Daytona sandbox creation and execution
 */

require('dotenv').config({ path: '.env.local' });
const { Daytona } = require('@daytonaio/sdk');

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

async function testDaytona() {
  log('\n🧪 Testing Daytona Integration\n', colors.cyan + colors.bright);

  // Check API key
  const apiKey = process.env.DAYTONA_API_KEY;
  const apiUrl = process.env.DAYTONA_API_URL || 'https://app.daytona.io/api';

  if (!apiKey || apiKey.includes('your-') || apiKey.includes('here')) {
    log('❌ DAYTONA_API_KEY not configured', colors.red);
    log('   Please set your Daytona API key in .env.local', colors.yellow);
    log('   Get your key at: https://app.daytona.io/dashboard/keys\n', colors.yellow);
    process.exit(1);
  }

  log('✅ API Key configured', colors.green);
  log(`📡 API URL: ${apiUrl}`, colors.blue);

  try {
    log('\n🚀 Creating Daytona sandbox...', colors.blue);
    
    const daytona = new Daytona({
      apiKey: apiKey,
      apiUrl: apiUrl
    });

    const sandbox = await daytona.create();
    log(`✅ Sandbox created: ${sandbox.id}`, colors.green);

    // Test file upload
    log('\n📤 Testing file upload...', colors.blue);
    const testCode = `print("Hello from Daytona!")
for i in range(5):
    print(f"Count: {i}")
`;

    await sandbox.fs.uploadFile({
      path: '/home/daytona/test.py',
      data: Buffer.from(testCode).toString('base64')
    });
    log('✅ File uploaded successfully', colors.green);

    // Test code execution
    log('\n▶️  Executing test code...', colors.blue);
    const result = await sandbox.process.exec({
      cmd: 'python3 test.py',
      cwd: '/home/daytona'
    });

    log('✅ Code executed successfully', colors.green);
    
    if (result.stdout) {
      log('\n📄 Output:', colors.cyan);
      log(result.stdout, colors.reset);
    }

    if (result.stderr) {
      log('\n⚠️  Stderr:', colors.yellow);
      log(result.stderr, colors.reset);
    }

    log(`\n📊 Exit Code: ${result.exitCode || 0}`, colors.blue);

    // Clean up
    log('\n🧹 Cleaning up sandbox...', colors.blue);
    await daytona.delete(sandbox.id);
    log('✅ Sandbox deleted', colors.green);

    // Success summary
    log('\n' + '='.repeat(50), colors.cyan);
    log('\n✅ Daytona Integration Test PASSED!', colors.green + colors.bright);
    log('\nAll Daytona operations working correctly:', colors.green);
    log('  ✓ Sandbox creation', colors.green);
    log('  ✓ File upload', colors.green);
    log('  ✓ Code execution', colors.green);
    log('  ✓ Sandbox cleanup', colors.green);
    log('\nYou\'re ready to use the application!\n', colors.green);

  } catch (error) {
    log('\n' + '='.repeat(50), colors.red);
    log('\n❌ Daytona Integration Test FAILED', colors.red + colors.bright);
    log('\nError Details:', colors.red);
    log(error.message || String(error), colors.reset);
    
    if (error.response) {
      log('\nAPI Response:', colors.yellow);
      log(JSON.stringify(error.response.data, null, 2), colors.reset);
    }

    log('\n🔧 Troubleshooting:', colors.yellow);
    log('  1. Verify your DAYTONA_API_KEY in .env.local', colors.yellow);
    log('  2. Check permissions: write:sandboxes, delete:sandboxes', colors.yellow);
    log('  3. Ensure you have resources available in your Daytona account', colors.yellow);
    log('  4. Check https://app.daytona.io/dashboard for account status\n', colors.yellow);
    
    process.exit(1);
  }
}

// Run the test
testDaytona().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});

