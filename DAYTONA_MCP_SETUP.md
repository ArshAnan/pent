# Daytona MCP Server Setup Guide

## Quick Setup Steps

### Step 1: Authenticate with Daytona
✅ **Daytona CLI is already installed** (v0.112.2)

Run this command in your terminal:
```bash
daytona login
```

This will open your browser where you can sign in to your Daytona account.

### Step 2: Initialize MCP for Cursor (Automatic Method)

After authentication, run:
```bash
daytona mcp init cursor
```

This will automatically configure Cursor to use the Daytona MCP server.

### Step 3: Manual Configuration (Alternative)

If the automatic initialization doesn't work, you can manually configure Cursor:

1. **Open Cursor Settings**:
   - Press `Cmd + ,` (Mac) or `Ctrl + ,` (Windows/Linux)
   - Or go to: Cursor → Settings

2. **Navigate to MCP Settings**:
   - Search for "MCP" in the settings search bar
   - Look for "Model Context Protocol" or "MCP Servers" section

3. **Add the Configuration**:
   Copy the contents of `daytona-mcp-config.json` into your Cursor MCP settings:
   
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

4. **Restart Cursor**:
   Close and reopen Cursor for the changes to take effect.

## Verification

After setup, verify that the MCP server is working:

1. Open Cursor
2. Start a new chat with the AI
3. Try asking: "Can you list available Daytona sandboxes?"
4. The AI should be able to interact with Daytona through MCP

## Available Daytona MCP Tools

Once configured, you'll have access to these tools:

### Sandbox Management
- **Create Sandbox**: Create new development environments
- **Destroy Sandbox**: Remove existing sandboxes
- **List Sandboxes**: View all your sandboxes

### File Operations
- **Download File**: Get files from sandboxes
- **Upload File**: Send files to sandboxes
- **Create Folder**: Make new directories
- **Get File Info**: Check file metadata
- **List Files**: Browse directory contents
- **Move File**: Rename or relocate files
- **Delete File**: Remove files or directories

### Preview & Networking
- **Preview Link**: Generate accessible URLs for web apps running in sandboxes

### Git Operations
- **Git Clone**: Clone repositories into sandboxes

### Command Execution
- **Execute Command**: Run shell commands in sandboxes

## Troubleshooting

### Authentication Issues
If you have trouble logging in:
```bash
# Check if you're authenticated
daytona profile list

# Re-authenticate if needed
daytona login
```

### Connection Errors
Check if the MCP server is running:
```bash
# Test MCP configuration
daytona mcp config

# Check MCP server logs
tail -f ~/Library/Logs/daytona/daytona-mcp-server.log
```

### Sandbox Errors
List your sandboxes to verify access:
```bash
daytona sandbox list
```

## Useful Commands

```bash
# Check Daytona version
daytona version

# View help for MCP commands
daytona mcp --help

# Get MCP configuration
daytona mcp config

# List all sandboxes
daytona sandbox list

# Create a new sandbox
daytona sandbox create

# View profile information
daytona profile list
```

## Example Usage in Cursor

Once set up, you can ask the AI assistant things like:

1. "Create a new Daytona sandbox for my React project"
2. "Upload this file to my sandbox"
3. "Clone the repository https://github.com/user/repo into my sandbox"
4. "Execute 'npm install' in my sandbox"
5. "Generate a preview link for port 3000"
6. "Download the build artifacts from my sandbox"

## Support Resources

- **Documentation**: [daytona.io/docs](https://daytona.io/docs)
- **Support Email**: support@daytona.io
- **Community**: [Daytona Community](https://daytona.io/community)

## Next Steps

1. ✅ Install Daytona CLI (Complete)
2. ⏳ Run `daytona login` in your terminal
3. ⏳ Run `daytona mcp init cursor` or manually configure
4. ⏳ Restart Cursor
5. ⏳ Start using Daytona features through AI assistance!

