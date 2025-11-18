#!/bin/bash

# Daytona MCP Setup Verification Script
# Run this after completing the setup steps

echo "🔍 Daytona MCP Setup Verification"
echo "=================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: Daytona CLI installed
echo -n "1. Checking Daytona CLI installation... "
if command -v daytona &> /dev/null; then
    VERSION=$(daytona version 2>&1)
    echo -e "${GREEN}✓ Installed${NC}"
    echo "   Version: $VERSION"
else
    echo -e "${RED}✗ Not found${NC}"
    echo "   Run: brew install daytonaio/cli/daytona"
    exit 1
fi
echo ""

# Check 2: Authentication
echo -n "2. Checking Daytona authentication... "
if daytona profile list &> /dev/null; then
    echo -e "${GREEN}✓ Authenticated${NC}"
    PROFILE=$(daytona profile list 2>&1 | head -n 2 | tail -n 1)
    echo "   $PROFILE"
else
    echo -e "${RED}✗ Not authenticated${NC}"
    echo "   Run: daytona login"
    exit 1
fi
echo ""

# Check 3: MCP commands available
echo -n "3. Checking MCP commands... "
if daytona mcp --help &> /dev/null; then
    echo -e "${GREEN}✓ Available${NC}"
    echo "   Commands: config, init, start"
else
    echo -e "${RED}✗ Not available${NC}"
    exit 1
fi
echo ""

# Check 4: MCP configuration
echo "4. MCP Configuration:"
echo "   Run: daytona mcp config"
echo "   Copy the output to Cursor settings if not already done"
echo ""

# Check 5: Log directory
echo -n "5. Checking log directory... "
LOG_DIR="$HOME/Library/Logs/daytona"
if [ -d "$LOG_DIR" ]; then
    echo -e "${GREEN}✓ Exists${NC}"
    echo "   Path: $LOG_DIR"
else
    echo -e "${YELLOW}⚠ Not found (will be created on first MCP start)${NC}"
fi
echo ""

# Check 6: Sandbox access
echo -n "6. Testing sandbox access... "
if daytona sandbox list &> /dev/null; then
    echo -e "${GREEN}✓ Working${NC}"
    SANDBOX_COUNT=$(daytona sandbox list 2>&1 | grep -c "│" || echo "0")
    if [ "$SANDBOX_COUNT" -gt 0 ]; then
        echo "   Active sandboxes: Found"
    else
        echo "   Active sandboxes: None (this is normal)"
    fi
else
    echo -e "${RED}✗ Failed${NC}"
    echo "   Check your Daytona account and API access"
fi
echo ""

# Summary
echo "=================================="
echo "📋 Next Steps:"
echo ""
echo "1. If not already done, run:"
echo "   ${YELLOW}daytona mcp init cursor${NC}"
echo ""
echo "2. Or manually add MCP config to Cursor:"
echo "   - Open Cursor Settings (Cmd+,)"
echo "   - Search for 'MCP'"
echo "   - Run: ${YELLOW}daytona mcp config${NC}"
echo "   - Copy the JSON output to Cursor MCP settings"
echo ""
echo "3. Restart Cursor completely"
echo ""
echo "4. Test by asking the AI:"
echo "   ${YELLOW}\"Create a new Daytona sandbox\"${NC}"
echo ""
echo "📖 Documentation:"
echo "   - Setup Guide: DAYTONA_MCP_SETUP.md"
echo "   - Integration Guide: DAYTONA_MCP_INTEGRATION.md"
echo "   - Quick Reference: DAYTONA_MCP_QUICKREF.md"
echo ""
echo "✅ Verification complete!"

