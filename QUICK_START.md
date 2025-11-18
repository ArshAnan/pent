# ⚡ Quick Start - 5 Minutes Setup

Get your AI Code Security Analyzer running in just 5 minutes!

## 📋 Prerequisites Checklist

- [ ] Node.js 20+ installed
- [ ] Daytona account created
- [ ] OpenAI account created

## 🚀 Setup Steps

### 1️⃣ Get Your API Keys (2 minutes)

**Daytona API Key:**
- Go to https://app.daytona.io/dashboard/keys
- Click "Create Key"
- Select permissions: `write:sandboxes`, `delete:sandboxes`
- Copy your key (starts with `daytona_`)

**OpenAI API Key:**
- Go to https://platform.openai.com/api-keys
- Click "Create new secret key"
- Copy your key (starts with `sk-`)

### 2️⃣ Configure Environment (1 minute)

```bash
# Copy the example file
cp .env.example .env.local

# Edit with your favorite editor
nano .env.local
```

Paste your API keys:
```env
DAYTONA_API_KEY=daytona_your_key_here
DAYTONA_API_URL=https://app.daytona.io/api
OPENAI_API_KEY=sk-your_key_here
```

Save and exit (Ctrl+X, then Y, then Enter for nano)

### 3️⃣ Install & Verify (2 minutes)

```bash
# Install dependencies
npm install

# Verify everything is set up correctly
npm run verify
```

If you see "✅ Setup verification PASSED!", you're ready!

### 4️⃣ Run the App (10 seconds)

```bash
npm run dev
```

Open http://localhost:3000 in your browser

### 5️⃣ Test It Out (30 seconds)

**Option A: Single File**
1. Click "Load Example"
2. Click "Run Security Analysis"
3. Watch it detect vulnerabilities and generate fixes!

**Option B: ZIP Upload**
1. Click the "📦 ZIP Upload" tab
2. Upload a ZIP file with your code
3. Click "Run Security Analysis"
4. Browse results for each file!

## 🎉 That's It!

Your AI Code Security Analyzer is now running!

## 🆘 Troubleshooting

**"Command not found: npm"**
- Install Node.js from https://nodejs.org

**"Setup verification FAILED"**
- Make sure you created `.env.local` (not `.env`)
- Double-check your API keys are correct
- Ensure no extra spaces in the `.env.local` file

**"DAYTONA_API_KEY not configured"**
- Restart the dev server: stop (Ctrl+C) and run `npm run dev` again
- Verify `.env.local` exists in the project root

**"OPENAI_API_KEY not configured"**
- Check you have credits in your OpenAI account
- Verify the API key is correct

## 📚 Next Steps

- Read [SETUP.md](./SETUP.md) for detailed setup instructions
- Check [EXAMPLES.md](./EXAMPLES.md) for code samples to test
- Review [README.md](./README.md) for full documentation
- See [CONTRIBUTING.md](./CONTRIBUTING.md) to extend the tool

## 💡 Tips

- **Save Money**: Use "Static" analysis mode to avoid API costs during testing
- **Try Examples**: Use the "Load Example" button to see how it works
- **Different Languages**: Test Python, JavaScript, TypeScript, Bash, Go, and Java
- **Dynamic Analysis**: Enable "Both" mode for complete sandbox testing

## 🔗 Useful Links

- [Daytona Dashboard](https://app.daytona.io/dashboard)
- [Daytona Documentation](https://www.daytona.io/docs)
- [OpenAI Platform](https://platform.openai.com)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

**Need help?** Open an issue or check the full [README.md](./README.md)

