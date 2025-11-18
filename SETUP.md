# 🚀 Quick Setup Guide

Follow these steps to get your AI Code Security Analyzer up and running in minutes.

## Step 1: Get Your API Keys

### Daytona API Key

1. Go to [Daytona Dashboard](https://app.daytona.io/dashboard/keys)
2. Sign up or log in to your account
3. Click **"Create Key"**
4. Select the following permissions:
   - ✅ `write:sandboxes` - Create/modify sandboxes
   - ✅ `delete:sandboxes` - Delete sandboxes
5. Copy your API key (it starts with `daytona_`)

### OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Click **"Create new secret key"**
4. Give it a name (e.g., "Code Security Analyzer")
5. Copy your API key (it starts with `sk-`)

⚠️ **Important**: Keep your API keys secret! Never commit them to version control.

## Step 2: Configure Environment Variables

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`:**
   ```bash
   # Use your favorite editor
   nano .env.local
   # or
   code .env.local
   ```

3. **Add your API keys:**
   ```env
   # Daytona API Configuration
   DAYTONA_API_KEY=daytona_your_actual_key_here
   DAYTONA_API_URL=https://app.daytona.io/api

   # OpenAI API Configuration
   OPENAI_API_KEY=sk-your_actual_key_here
   ```

4. **Save and close** the file

## Step 3: Install Dependencies

```bash
npm install
```

This will install:
- Next.js & React
- Daytona SDK
- OpenAI SDK
- TypeScript & Tailwind CSS
- All other dependencies

## Step 4: Run the Application

```bash
npm run dev
```

You should see:
```
✓ Ready in 2.5s
➜ Local:   http://localhost:3000
```

## Step 5: Test It Out

**Option 1: Test with Example Code**
1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. Click **"Load Example"** to see a vulnerable code sample
3. Click **"Run Security Analysis"**
4. Wait for the analysis to complete
5. Review the vulnerabilities and AI-powered fix suggestions!

**Option 2: Test ZIP Upload**
1. Create a ZIP file with some code files (Python, JS, etc.)
2. Click the **"📦 ZIP Upload"** tab
3. Upload your ZIP file
4. Review the extracted files
5. Click **"Run Security Analysis"**
6. Browse results for each file!

**Option 3: Test Daytona Integration**
```bash
npm run test:daytona
```
This will verify that Daytona sandbox creation and execution works correctly.

## 🎉 You're Done!

Your AI Code Security Analyzer is now running. Try analyzing different types of code to see what vulnerabilities it can detect.

## 🔍 Troubleshooting

### "DAYTONA_API_KEY not configured"

- Make sure `.env.local` exists in the root directory
- Check that your Daytona API key is correctly set
- Restart the dev server after adding environment variables

### "OPENAI_API_KEY not configured"

- Make sure your OpenAI API key is in `.env.local`
- Verify the key starts with `sk-`
- Check that you have credits in your OpenAI account

### Sandbox Creation Fails

- Verify your Daytona API key has the correct permissions
- Check your Daytona account has available resources
- Review the Daytona Dashboard for any account issues

### Module Not Found Errors

- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then run `npm install`
- Make sure you're using Node.js 20 or higher

## 💡 Tips

- **Static Analysis Only**: If you want to avoid sandbox/API costs during development, use "Static" analysis mode
- **Test with Examples**: Start with the provided example code to ensure everything works
- **Monitor Costs**: Keep an eye on your Daytona and OpenAI usage in their respective dashboards
- **Security**: Never commit your `.env.local` file to version control

## 📚 Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Explore the [Daytona Docs](https://www.daytona.io/docs) to learn more about sandboxes
- Check out the [OpenAI API Docs](https://platform.openai.com/docs) for AI capabilities
- Customize the vulnerability patterns in `lib/vulnerability-checks.ts`

## 🆘 Need Help?

- Check the [README.md](./README.md) for more information
- Open an issue on GitHub
- Review the Daytona and OpenAI documentation

---

Happy security testing! 🛡️

