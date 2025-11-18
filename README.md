# 🛡️ AI Code Security Analyzer

An advanced penetration testing application for AI-generated code that detects security vulnerabilities and provides intelligent fix suggestions using Daytona sandboxes and OpenAI.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## ✨ Features

- **🔍 Static Code Analysis** - Pattern-based detection of common vulnerabilities (SQL injection, XSS, hardcoded secrets, etc.)
- **🚀 Dynamic Sandbox Testing** - Execute code in isolated Daytona sandboxes to detect runtime vulnerabilities
- **🤖 AI-Powered Fix Suggestions** - Get intelligent, context-aware security fixes from OpenAI GPT-4
- **📦 ZIP File Upload** - Analyze entire projects at once by uploading ZIP files
- **📊 Comprehensive Reports** - Detailed vulnerability reports with severity levels, CWE references, and risk assessment
- **🎨 Modern UI** - Beautiful, responsive interface built with Next.js and Tailwind CSS
- **🔐 Multi-Language Support** - Analyze Python, JavaScript, TypeScript, Bash, Go, and Java code
- **📂 Multi-File Analysis** - Process multiple files in a single Daytona sandbox for realistic testing
- **🔌 Daytona MCP Integration** - Interactive sandbox management through AI chat using Model Context Protocol

## 🔌 Daytona MCP Server Integration

This project now supports the **Daytona Model Context Protocol (MCP) Server**, enabling you to interact with Daytona sandboxes directly through AI chat in Cursor!

### What is MCP?

The Daytona MCP Server allows you to manage sandboxes, upload files, execute commands, and more using natural language - all without writing code.

### Quick Setup

```bash
# Install Daytona CLI (already done if following this guide)
brew install daytonaio/cli/daytona

# Authenticate
daytona login

# Initialize for Cursor
daytona mcp init cursor

# Restart Cursor and start using!
```

### Example Usage

Once set up, you can interact with Daytona through AI chat:

- "Create a new Daytona sandbox for Python testing"
- "Upload this vulnerable code and run security analysis"
- "Generate a preview link for my running app on port 3000"
- "Clone this repository and install dependencies"

### Documentation

- **Setup Guide**: `DAYTONA_MCP_SETUP.md` - Complete setup instructions
- **Integration Guide**: `DAYTONA_MCP_INTEGRATION.md` - Project-specific workflows
- **Quick Reference**: `DAYTONA_MCP_QUICKREF.md` - Command cheat sheet
- **Verification Script**: `scripts/verify-mcp-setup.sh` - Test your setup

### SDK vs MCP

- **Daytona SDK** (Current): Perfect for automated, programmatic workflows in your API routes
- **Daytona MCP** (New): Perfect for interactive, exploratory work via AI chat

Both work together seamlessly! Use the SDK for production automation and MCP for development and testing.

## 🏗️ Architecture

```
┌─────────────────┐
│   Frontend UI   │
│   (Next.js)     │
└────────┬────────┘
         │
         ├─────────────────────────────────┐
         │                                 │
         ▼                                 ▼
┌────────────────┐              ┌──────────────────┐
│  Pentest API   │              │ Suggest Fixes API│
│                │              │                  │
│ • Static Scan  │              │ • OpenAI GPT-4   │
│ • Daytona      │              │ • Fix Generation │
│   Sandbox Exec │              │ • Best Practices │
└────────────────┘              └──────────────────┘
         │
         ▼
┌────────────────┐
│ Daytona SDK    │
│ Sandboxes      │
└────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 20+** and npm
- **Daytona API Key** - Get yours at [Daytona Dashboard](https://app.daytona.io/dashboard/keys)
- **OpenAI API Key** - Get yours at [OpenAI Platform](https://platform.openai.com/api-keys)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your API keys:
   ```env
   # Daytona API Configuration
   DAYTONA_API_KEY=your-daytona-api-key-here
   DAYTONA_API_URL=https://app.daytona.io/api

   # OpenAI API Configuration
   OPENAI_API_KEY=your-openai-api-key-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Basic Workflow

**Option 1: Single File Analysis**
1. **Paste or Write Code** - Enter the code you want to analyze in the code editor
2. **Select Language** - Choose the programming language (Python, JavaScript, etc.)
3. **Choose Analysis Type**:
   - **Static**: Fast pattern-based analysis (no execution)
   - **Dynamic**: Execute in Daytona sandbox for runtime analysis
   - **Both**: Complete analysis (recommended)
4. **Run Analysis** - Click "Run Security Analysis"
5. **Review Results** - See detected vulnerabilities with severity levels
6. **Get AI Fixes** - Automatically receive AI-generated fix suggestions

**Option 2: Multi-File Analysis (ZIP Upload)**
1. **Switch to ZIP Upload Tab** - Click the "📦 ZIP Upload" tab
2. **Upload ZIP File** - Drop or select a ZIP file containing your project
3. **Review Extracted Files** - See the list of code files that will be analyzed
4. **Choose Analysis Type** - Select Static, Dynamic, or Both
5. **Run Analysis** - Click "Run Security Analysis"
6. **Browse Results** - Click on each file to see its specific vulnerabilities
7. **Get AI Fixes** - Receive fixes for each file's issues

### Example Vulnerable Code

Try this example Python code with multiple vulnerabilities:

```python
import os
import pickle

def process_user_input(user_input):
    # SQL Injection vulnerability
    query = f"SELECT * FROM users WHERE username = '{user_input}'"
    
    # Command injection vulnerability
    os.system(f"echo {user_input}")
    
    # Insecure deserialization
    data = pickle.loads(user_input.encode())
    
    # Hardcoded credentials
    api_key = "sk-1234567890abcdef"
    password = "admin123"
    
    return query

user_data = input("Enter username: ")
result = process_user_input(user_data)
print(result)
```

## 🔒 Detected Vulnerabilities

The analyzer can detect these vulnerability types:

| Vulnerability | CWE | Severity |
|--------------|-----|----------|
| SQL/Command Injection | CWE-89, CWE-78 | Critical |
| Cross-Site Scripting (XSS) | CWE-79 | High |
| Hardcoded Credentials | CWE-798 | Critical |
| Path Traversal | CWE-22 | High |
| Insecure Deserialization | CWE-502 | Critical |
| Weak Cryptography | CWE-327 | Medium |
| Open Redirect | CWE-601 | Medium |
| Insufficient Input Validation | CWE-20 | High |
| Insecure Randomness | CWE-330 | High |
| SSRF | CWE-918 | High |

## 🛠️ Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Sandbox**: Daytona SDK
- **AI**: OpenAI GPT-4o
- **Validation**: Zod

## 📂 Project Structure

```
pent/
├── app/
│   ├── api/
│   │   ├── pentest/
│   │   │   └── route.ts          # Single file pen testing
│   │   ├── pentest-multi/
│   │   │   └── route.ts          # Multi-file pen testing
│   │   ├── suggest-fixes/
│   │   │   └── route.ts          # AI fix suggestions (single)
│   │   ├── suggest-fixes-multi/
│   │   │   └── route.ts          # AI fix suggestions (multi)
│   │   └── upload/
│   │       └── route.ts          # ZIP file upload handler
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main UI with tabs
├── lib/
│   ├── types.ts                  # TypeScript types
│   ├── vulnerability-checks.ts   # Vulnerability detection logic
│   └── file-utils.ts             # File handling utilities
├── scripts/
│   ├── verify-setup.js           # Setup verification script
│   └── test-daytona.js           # Daytona integration test
├── .env.example                  # Environment variables template
└── package.json                  # Dependencies
```

## 🔧 API Endpoints

### POST `/api/pentest`

Performs security analysis on a single code file.

**Request Body:**
```json
{
  "code": "string",
  "language": "python" | "javascript" | "typescript" | "bash" | "go" | "java",
  "testType": "static" | "dynamic" | "both"
}
```

### POST `/api/pentest-multi`

Performs security analysis on multiple code files.

**Request Body:**
```json
{
  "files": [
    {
      "filename": "string",
      "content": "string",
      "language": "python" | "javascript" | ...
    }
  ],
  "testType": "static" | "dynamic" | "both"
}
```

**Response:**
```json
{
  "files": [...],
  "overallRiskLevel": "low" | "medium" | "high" | "critical",
  "totalVulnerabilities": number,
  "sandboxId": "string",
  "timestamp": "ISO8601"
}
```

### POST `/api/upload`

Extracts code files from uploaded ZIP.

**Request:** multipart/form-data with file

**Response:**
```json
{
  "success": true,
  "files": [...],
  "totalFiles": number,
  "message": "string"
}
```

### POST `/api/suggest-fixes`

Generates AI-powered fix suggestions for single file.

### POST `/api/suggest-fixes-multi`

Generates AI-powered fix suggestions for multiple files.

## 🔐 Security Considerations

- All code execution happens in isolated Daytona sandboxes
- Sandboxes are automatically cleaned up after analysis
- No code is stored permanently
- API keys are stored securely in environment variables
- Never commit `.env.local` to version control

## 📊 Cost Considerations

- **Daytona**: Charges per sandbox usage (see [Daytona Pricing](https://www.daytona.io/pricing))
- **OpenAI**: Charges per token (GPT-4o pricing applies)
- Static analysis only mode incurs no external API costs

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Daytona](https://daytona.io) - Secure sandbox environments
- [OpenAI](https://openai.com) - AI-powered fix suggestions
- [OWASP](https://owasp.org) - Security vulnerability references

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the maintainers

## 🚨 Disclaimer

This tool is designed to help identify common security vulnerabilities but should not be considered a complete security solution. Always conduct thorough security reviews and testing before deploying code to production.

---

**Built with ❤️ using Next.js, Daytona, and OpenAI**
