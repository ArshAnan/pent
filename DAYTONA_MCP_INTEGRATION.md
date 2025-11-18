# Daytona MCP Integration for AI Code Security Analyzer

## Overview

Your project already uses the Daytona SDK (`@daytonaio/sdk`) programmatically. With Daytona MCP Server, you can now interact with Daytona directly through the AI assistant in Cursor!

## Benefits for Your Project

### Current Workflow (SDK-based)
```
Code → Upload to UI → API Routes → Daytona SDK → Sandbox → Results
```

### New Workflow (MCP-enabled)
```
Natural Language → AI Assistant → Daytona MCP → Sandboxes
```

### What You Can Do with MCP

1. **Manage Sandboxes Directly in Chat**
   - "Create a new Daytona sandbox for testing"
   - "List all my active sandboxes"
   - "Destroy sandbox xyz-123"

2. **Upload Test Files**
   - "Upload this vulnerable Python file to my sandbox"
   - "Create a test directory and upload multiple files"

3. **Execute Security Tests**
   - "Run static analysis on the uploaded files"
   - "Execute this Python script in the sandbox"
   - "Install dependencies in my sandbox"

4. **Preview Web Applications**
   - "Generate a preview link for port 3000"
   - "Show me the running application"

5. **Collaborative Testing**
   - "Clone this repository into a sandbox"
   - "Download the test results from my sandbox"

## Setup Instructions

### 1. ✅ Install Daytona CLI (Already Done!)
The CLI is installed at version v0.112.2.

### 2. Authenticate with Daytona

Open a terminal and run:
```bash
daytona login
```

**Note**: You already have a Daytona API key in your `.env.local` for the SDK. The MCP server uses the same Daytona account but authenticates via CLI.

### 3. Initialize MCP for Cursor

```bash
daytona mcp init cursor
```

This automatically configures Cursor. Alternatively, use the manual method below.

### 4. Manual Configuration (If Needed)

Add this to Cursor's MCP settings:

```json
{
  "mcpServers": {
    "daytona-mcp": {
      "command": "daytona",
      "args": ["mcp", "start"],
      "env": {
        "HOME": "${HOME}",
        "PATH": "${HOME}:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin"
      },
      "logFile": "${HOME}/Library/Logs/daytona/daytona-mcp-server.log"
    }
  }
}
```

### 5. Restart Cursor

Close and reopen Cursor for changes to take effect.

## Practical Examples for Your Project

### Example 1: Test Vulnerable Code in a Sandbox

**Ask the AI:**
```
Create a new Daytona sandbox and upload this Python code to test for vulnerabilities:

[paste vulnerable code]

Then run static analysis on it.
```

**What happens:**
1. AI creates a sandbox via MCP
2. Uploads the code file
3. Executes security checks
4. Reports results

### Example 2: Multi-File Project Analysis

**Ask the AI:**
```
1. Create a sandbox
2. Clone my repository: https://github.com/user/repo
3. Install dependencies
4. Run my security analyzer on the codebase
```

### Example 3: Preview Your Application

**Ask the AI:**
```
I'm running my security analyzer on port 3000 in sandbox abc-123. 
Generate a preview link so I can share it.
```

### Example 4: Batch Testing

**Ask the AI:**
```
Create 3 sandboxes with the following configurations:
1. Python 3.11 with pytest
2. Node.js 20 with npm
3. Go 1.21 with go test

Upload my test files to each and run the appropriate tests.
```

### Example 5: Cleanup After Testing

**Ask the AI:**
```
List all my sandboxes and destroy any that are older than 1 hour.
```

## Integration with Your Existing Code

### Current SDK Usage
Your code uses the SDK directly:

```typescript
import { Daytona } from '@daytonaio/sdk';

const daytona = new Daytona({
  apiKey: process.env.DAYTONA_API_KEY,
  serverURL: process.env.DAYTONA_API_URL
});
```

### MCP Complements SDK
- **SDK**: Perfect for automated, programmatic workflows (your APIs)
- **MCP**: Perfect for interactive, exploratory work (via AI chat)

You can use both simultaneously! The SDK handles your automated testing pipeline, while MCP lets you manually interact with sandboxes through natural language.

## Workflow Ideas

### Development Workflow
1. **Build Features** - Use MCP to create test sandboxes
2. **Test Manually** - Upload files and run tests via chat
3. **Iterate** - Get immediate feedback
4. **Deploy** - Use SDK in your API routes for production

### Security Testing Workflow
1. **Setup** - "Create a sandbox for Python security testing"
2. **Upload** - "Upload these 10 vulnerable Python files"
3. **Test** - "Run my vulnerability scanner on all files"
4. **Analyze** - "Download the results and show me the summary"
5. **Cleanup** - "Destroy the sandbox"

### Collaborative Review Workflow
1. **Share** - "Generate a preview link for my running analyzer"
2. **Review** - Team members access the link
3. **Iterate** - Make changes and regenerate preview
4. **Document** - "Download all test results to my local machine"

## MCP Commands Reference

### Sandbox Operations
```
"Create a new Daytona sandbox"
"Create a sandbox with 4 CPU cores and 8GB RAM"
"Create a sandbox with auto-stop after 30 minutes"
"List all my sandboxes"
"Show details for sandbox xyz-123"
"Destroy sandbox xyz-123"
"Stop all running sandboxes"
```

### File Operations
```
"Upload this file to sandbox xyz-123 at path /app/test.py"
"Download /app/results.json from sandbox xyz-123"
"List files in /app directory of sandbox xyz-123"
"Create folder /app/tests in sandbox xyz-123"
"Delete /app/temp.txt from sandbox xyz-123"
```

### Code Execution
```
"Execute 'pip install -r requirements.txt' in sandbox xyz-123"
"Run 'python test.py' in sandbox xyz-123"
"Execute 'npm run dev' in sandbox xyz-123"
```

### Git Operations
```
"Clone https://github.com/user/repo into sandbox xyz-123"
"Clone branch 'develop' of https://github.com/user/repo"
```

### Preview & Networking
```
"Generate preview link for port 3000 in sandbox xyz-123"
"Create a preview link for my Next.js app on port 3000"
```

## Troubleshooting

### Issue: MCP Not Recognized
**Solution:**
```bash
# Verify Daytona CLI is installed
daytona version

# Check if you're authenticated
daytona profile list

# Re-initialize MCP
daytona mcp init cursor
```

### Issue: Authentication Failed
**Solution:**
```bash
# Re-authenticate
daytona login

# Verify authentication
daytona sandbox list
```

### Issue: Sandbox Creation Fails
**Solution:**
Check your Daytona account quotas and active sandboxes:
```bash
daytona sandbox list
```

### Issue: Can't See MCP Tools in Cursor
**Solution:**
1. Verify configuration: `daytona mcp config`
2. Check logs: `tail -f ~/Library/Logs/daytona/daytona-mcp-server.log`
3. Restart Cursor completely

## Cost Optimization

### SDK (Current)
- Automatically creates and destroys sandboxes per request
- Billed per sandbox usage
- Efficient for API workflows

### MCP (New)
- Manual sandbox management
- Can reuse sandboxes for multiple operations
- More control over costs

**Tip**: Use MCP to create a sandbox, perform multiple operations, then destroy it manually to minimize costs.

## Next Steps

1. ✅ **Install CLI** - Complete!
2. ⏳ **Authenticate** - Run `daytona login`
3. ⏳ **Initialize MCP** - Run `daytona mcp init cursor`
4. ⏳ **Restart Cursor** - Close and reopen
5. ⏳ **Test** - Ask: "Create a Daytona sandbox"
6. ⏳ **Integrate** - Start using in your workflow!

## Example Session

Here's what a complete testing session might look like:

**You:** "Create a new Daytona sandbox for Python security testing"

**AI:** *Creates sandbox via MCP*
- Sandbox ID: secure-test-abc123
- Status: Running
- CPU: 2 cores, Memory: 4GB

**You:** "Upload this vulnerable code to /app/test.py"

**AI:** *Uploads file*
- Uploaded: test.py (1.2 KB)
- Path: /app/test.py

**You:** "Execute 'python test.py' in the sandbox"

**AI:** *Runs command*
- Exit code: 1
- Error: "Detected SQL injection vulnerability at line 7"

**You:** "Generate a fix for this vulnerability"

**AI:** *Uses OpenAI to suggest fix*
- Recommendation: Use parameterized queries
- Code example: [shows corrected code]

**You:** "Upload the fixed code and test again"

**AI:** *Uploads and tests*
- Exit code: 0
- Success: No vulnerabilities detected

**You:** "Destroy the sandbox"

**AI:** *Cleans up*
- Sandbox secure-test-abc123 destroyed

## Support & Resources

- **Daytona Docs**: [daytona.io/docs](https://daytona.io/docs)
- **MCP Specification**: [MCP Documentation](https://modelcontextprotocol.io)
- **Your Project Docs**: See README.md for project-specific details
- **Support**: support@daytona.io

---

**Ready to supercharge your security testing workflow! 🚀🔒**

