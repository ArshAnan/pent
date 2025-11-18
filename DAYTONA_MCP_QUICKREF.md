# Daytona MCP Quick Reference

## 🚀 Quick Setup (Do Once)

```bash
# 1. Authenticate
daytona login

# 2. Initialize for Cursor
daytona mcp init cursor

# 3. Restart Cursor
```

## 💬 Common AI Commands

### Sandbox Management
```
"Create a new Daytona sandbox"
"Create a Python sandbox with 4GB RAM"
"List all my sandboxes"
"Destroy sandbox [id]"
```

### File Operations
```
"Upload this code to sandbox [id] at /app/test.py"
"Download /app/results.json from sandbox [id]"
"List files in sandbox [id]"
"Create folder /app/src in sandbox [id]"
```

### Code Execution
```
"Run 'python test.py' in sandbox [id]"
"Execute 'npm install' in sandbox [id]"
"Install dependencies in sandbox [id]"
```

### Git & Projects
```
"Clone [repo-url] into sandbox [id]"
"Clone [repo-url] branch [branch-name]"
```

### Preview & Networking
```
"Generate preview link for port 3000 in sandbox [id]"
"Create preview for my Next.js app on port 3000"
```

## 🔧 Useful CLI Commands

```bash
# Check version
daytona version

# List sandboxes
daytona sandbox list

# Get MCP config
daytona mcp config

# Check logs
tail -f ~/Library/Logs/daytona/daytona-mcp-server.log

# Re-authenticate
daytona login

# Profile info
daytona profile list
```

## 🎯 Security Testing Workflow

1. **Create** → "Create a Python sandbox"
2. **Upload** → "Upload this vulnerable code"
3. **Test** → "Run security analysis"
4. **Fix** → "Generate fixes for the issues"
5. **Verify** → "Upload fixed code and retest"
6. **Cleanup** → "Destroy the sandbox"

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| MCP not working | `daytona mcp init cursor` |
| Auth failed | `daytona login` |
| Can't create sandbox | Check quotas with `daytona sandbox list` |
| Tools not visible | Restart Cursor completely |

## 📊 Cost Tips

- Reuse sandboxes for multiple operations
- Set auto-stop intervals to prevent idle costs
- Destroy sandboxes when done
- Use static analysis when possible (no sandbox needed)

## 🔗 Quick Links

- **Daytona Dashboard**: [app.daytona.io](https://app.daytona.io)
- **API Keys**: [app.daytona.io/dashboard/keys](https://app.daytona.io/dashboard/keys)
- **Documentation**: [daytona.io/docs](https://daytona.io/docs)
- **Support**: support@daytona.io

## ✨ Pro Tips

1. **Sandbox Templates**: Create sandboxes with specific configs and reuse
2. **Preview Links**: Share running apps with your team instantly
3. **Batch Operations**: Upload multiple files at once
4. **Automated Cleanup**: Ask AI to destroy old sandboxes periodically
5. **Combined Workflow**: Use MCP for exploration, SDK for automation

---

**Keep this handy while coding! 📋**

