# Daytona Sandbox Usage Guide 🚀

## Yes, Daytona IS Being Used! ✅

Your test confirmed it - the sandbox was created successfully:
```
✅ Sandbox created: 2f9902ed-a38a-4e8d-91ed-1fdb0eb93b61
```

## Why You Don't See Sandboxes in Your Dashboard

**Sandboxes are ephemeral and auto-deleted!** Here's the lifecycle:

```
1. Create sandbox      →  ~2-5 seconds
2. Upload code file    →  ~1 second  
3. Execute code        →  ~1-3 seconds
4. Analyze output      →  ~1 second
5. DELETE sandbox      →  ~1 second
─────────────────────────────────────
Total lifetime:         ~5-10 seconds
```

**Result:** By the time you check the dashboard, the sandbox is already gone! 🏃‍♂️💨

## When Are Sandboxes Created?

Daytona sandboxes are ONLY created when you select:

### **Dynamic Analysis Mode** 🔥
- **What it does:** Executes your code in an isolated Daytona sandbox
- **Detects:** Runtime vulnerabilities, execution errors, dangerous behaviors
- **Sandbox created:** YES ✅
- **Use case:** Test actual code execution

### **Both Analysis Mode** ⚡ (DEFAULT)
- **What it does:** Static pattern scan + Dynamic execution
- **Detects:** Everything (maximum security coverage)
- **Sandbox created:** YES ✅
- **Use case:** Complete security analysis (recommended)

### **Static Analysis Mode** 📝
- **What it does:** Fast pattern matching (no execution)
- **Detects:** Common vulnerabilities in source code
- **Sandbox created:** NO ❌
- **Use case:** Quick checks without execution

## NEW: Sandbox Status Indicator 🎯

I just added a real-time sandbox status indicator to the UI! Now you'll see:

### During Analysis:
```
┌────────────────────────────────────────┐
│ ⚡ 🚀 Creating Daytona sandbox...      │  ← Animated purple box
└────────────────────────────────────────┘
```

### After Completion:
```
┌─────────────────────────────────────────────────────┐
│ ⚡ ✅ Sandbox 2f9902ed... executed & cleaned up     │
└─────────────────────────────────────────────────────┘
```

### Before Analysis (Dynamic/Both mode):
```
┌─────────────────────────────────────────────────────┐
│ ⚡ Dynamic Analysis Enabled: Your code will be       │
│   executed in an isolated Daytona sandbox for       │
│   runtime vulnerability detection.                  │
└─────────────────────────────────────────────────────┘
```

## How to Verify Daytona is Working

### Method 1: Watch the UI (NEW!) 🎨
1. Make sure "Both" or "Dynamic" is selected
2. Click "Run Security Analysis"
3. Watch for the purple animated box: "🚀 Creating Daytona sandbox..."
4. After analysis, you'll see: "✅ Sandbox [ID]... executed & cleaned up"

### Method 2: Check Server Logs 📋
```bash
# Start the dev server with logs visible
npm run dev

# Run an analysis and watch the console output:
# You'll see:
# → Creating Daytona sandbox...
# → Sandbox created: [ID]
# → Uploading code to sandbox...
# → Executing code in sandbox...
# → Cleaning up sandbox...
# → Sandbox deleted
```

### Method 3: Check Network Tab 🌐
1. Open browser DevTools (F12)
2. Go to Network tab
3. Run analysis with "Both" or "Dynamic"
4. Look for POST request to `/api/pentest`
5. Check the response - it will include `sandboxId` if a sandbox was used

### Method 4: API Response Check 📊
The API response includes sandbox information:
```json
{
  "report": {
    "vulnerabilities": [...],
    "riskLevel": "high",
    "executionOutput": "...",  ← Only present with dynamic analysis
    "executionError": ""        ← Only present with dynamic analysis
  },
  "sandboxId": "2f9902ed-a38a-4e8d-91ed-1fdb0eb93b61",  ← Sandbox was used!
  "timestamp": "2024-11-18T..."
}
```

## Sandbox Lifecycle Details

### What Happens Inside a Daytona Sandbox

```typescript
// 1. Create isolated environment
const sandbox = await daytona.create();

// 2. Upload your code
await sandbox.fs.uploadFile(
  Buffer.from(code),
  `/home/daytona/test.py`
);

// 3. Execute in isolation
const result = await sandbox.process.executeCommand(
  'python3 test.py',
  '/home/daytona'
);

// 4. Analyze output for vulnerabilities
const runtimeVulns = analyzeExecutionOutput(
  result.result,
  result.exitCode
);

// 5. Clean up immediately
await sandbox.delete(); // ← THIS IS WHY YOU DON'T SEE IT!
```

## Sandbox Resources Used

Each analysis creates:
- **1 sandbox** for single file analysis
- **1 sandbox** for multi-file analysis (shared across all files)
- **CPU:** Minimal (quick execution)
- **Memory:** Minimal (small code snippets)
- **Disk:** ~10MB (code + runtime)
- **Lifetime:** 5-10 seconds

## Why Immediate Deletion?

✅ **Cost Efficiency:** Don't pay for idle resources  
✅ **Clean State:** Every analysis starts fresh  
✅ **No Pollution:** Previous runs don't affect new runs  
✅ **Security:** No lingering code or data  
✅ **Resource Management:** Stay within Daytona limits  

## What Gets Detected with Dynamic Analysis?

Beyond static analysis, dynamic execution catches:

1. **Runtime Errors:**
   - Syntax errors
   - Import failures
   - Dependency issues

2. **Execution Vulnerabilities:**
   - Actual command execution attempts
   - File system access patterns
   - Network calls made
   - Process spawning

3. **Behavioral Issues:**
   - Infinite loops (timeout detection)
   - Resource exhaustion
   - Unexpected exits

4. **Output Analysis:**
   - Error messages revealing vulnerabilities
   - Stack traces showing issues
   - Warning messages

## Troubleshooting

### "I selected 'Both' but no sandbox ID in response"

**Check these:**
1. Is `DAYTONA_API_KEY` set in `.env.local`?
2. Is your Daytona account active?
3. Do you have available sandbox quota?
4. Check browser console for errors
5. Check server console for logs

### "Sandbox creation failed"

**Common causes:**
```bash
# 1. Missing API key
# Fix: Add to .env.local
DAYTONA_API_KEY=your-actual-key-here

# 2. Invalid API key
# Fix: Generate new key at https://app.daytona.io/dashboard/keys

# 3. No resources available
# Fix: Check your Daytona dashboard for quota limits

# 4. Network issues
# Fix: Check internet connection and Daytona status
```

### "Test script shows sandbox created but UI doesn't"

This is **NORMAL!** The test script you ran DID create a sandbox successfully. The UI will now show sandbox status with the improvements I just added. Try running an analysis now and you'll see the status indicators.

## Performance Tips

### For Faster Analysis:
- Use **"Static"** mode for quick checks (no sandbox needed)
- Use **"Dynamic"** or **"Both"** when you need execution testing

### For Maximum Coverage:
- Always use **"Both"** mode (default)
- This gives you complete security analysis

## Summary

✅ **Daytona IS working** - Your test confirmed it  
✅ **Sandboxes ARE created** - Just deleted quickly  
✅ **Default mode USES Daytona** - "Both" creates sandboxes  
✅ **NEW UI indicators** - Now you can SEE it happening  
✅ **Automatic cleanup** - Sandboxes deleted after 5-10 seconds  
✅ **Cost efficient** - Only pay for active execution time  

---

## Quick Reference

| Mode | Daytona Used? | Speed | Detection |
|------|---------------|-------|-----------|
| Static | ❌ No | ⚡ Fast | Pattern-based |
| Dynamic | ✅ Yes | 🐢 Slower | Runtime + Pattern |
| Both | ✅ Yes | 🐢 Slower | Maximum coverage |

**Default:** Both ✅

---

**Now try running an analysis and watch for the purple sandbox status indicator!** 🚀

