# 📦 ZIP Upload Guide

This guide explains how to use the ZIP upload feature to analyze entire projects or multiple files at once.

## 🎯 Overview

The ZIP upload feature allows you to:
- Upload an entire project as a ZIP file
- Automatically extract and analyze all code files
- Process multiple files in a single Daytona sandbox
- Get per-file vulnerability reports and AI suggestions
- View overall project security statistics

## 📋 Supported File Types

The analyzer automatically extracts and analyzes these file types:

| Language | Extensions |
|----------|-----------|
| Python | `.py` |
| JavaScript | `.js`, `.jsx` |
| TypeScript | `.ts`, `.tsx` |
| Bash | `.sh`, `.bash` |
| Go | `.go` |
| Java | `.java` |

## 🚀 How to Use

### Step 1: Prepare Your ZIP File

Create a ZIP archive containing your code files:

```bash
# On macOS/Linux
zip -r myproject.zip myproject/

# Or using a GUI tool like:
# - macOS: Right-click folder → "Compress"
# - Windows: Right-click folder → "Send to" → "Compressed folder"
# - Linux: Right-click folder → "Compress"
```

### Step 2: Upload the ZIP

1. Open the application at http://localhost:3000
2. Click the **"📦 ZIP Upload"** tab
3. Click **"Click to upload ZIP file"** or drag & drop your ZIP file
4. Wait for extraction (usually takes 1-2 seconds)

### Step 3: Review Extracted Files

After upload, you'll see:
- Total number of code files found
- List of files with their detected language
- Files are ready for analysis

### Step 4: Run Analysis

1. Choose your analysis type:
   - **Static**: Fast pattern-based analysis (no execution)
   - **Dynamic**: Execute code in Daytona sandbox
   - **Both**: Complete analysis (recommended)

2. Click **"Run Security Analysis"**

3. Wait for analysis to complete:
   - Static analysis: ~1-5 seconds per file
   - Dynamic analysis: ~5-15 seconds per file (depends on Daytona)

### Step 5: Review Results

The results panel shows:

**Overview Card:**
- Overall risk level (Low/Medium/High/Critical)
- Total files analyzed
- Total vulnerabilities found

**Files List:**
- All analyzed files
- Number of issues per file
- Risk level per file
- Click any file to see details

**File Details:**
When you click a file, you'll see:
- All vulnerabilities detected in that file
- Severity levels for each issue
- AI-powered fix suggestions
- Corrected code snippets
- Prevention tips

## 📊 Example ZIP Structure

```
myproject.zip
├── api/
│   ├── auth.py          ✅ Will be analyzed
│   ├── users.py         ✅ Will be analyzed
│   └── __init__.py      ⚠️  May be skipped if empty
├── frontend/
│   ├── app.js           ✅ Will be analyzed
│   ├── auth.js          ✅ Will be analyzed
│   └── styles.css       ❌ Skipped (not code)
├── scripts/
│   ├── deploy.sh        ✅ Will be analyzed
│   └── backup.sh        ✅ Will be analyzed
├── node_modules/        ❌ Automatically excluded
├── .git/                ❌ Automatically excluded
├── package.json         ❌ Skipped (config file)
├── README.md            ❌ Skipped (documentation)
└── .env                 ❌ Skipped (hidden file)
```

## ⚙️ Configuration

### File Limits

- **Maximum ZIP size**: 10 MB
- **Maximum files to analyze**: 50 files
- **File size**: Individual files within reasonable size

These limits ensure fast analysis and prevent excessive API costs.

### Excluded Files & Directories

The analyzer automatically skips:

**Directories:**
- `node_modules/`
- `__pycache__/`
- `.git/`
- `dist/`
- `build/`
- `venv/`
- `.venv/`

**Files:**
- Hidden files (starting with `.`)
- Configuration files (`package.json`, `tsconfig.json`, etc.)
- Lock files (`package-lock.json`, etc.)
- Documentation files (`README.md`, `LICENSE`, etc.)

## 🎨 Creating Test ZIP Files

### Example 1: Python Project

```bash
# Create a test directory
mkdir python-test
cd python-test

# Create some Python files
cat > app.py << 'EOF'
import os
password = "admin123"  # Hardcoded credential
user_input = input("Enter command: ")
os.system(user_input)  # Command injection
EOF

cat > utils.py << 'EOF'
import pickle
def load_data(data):
    return pickle.loads(data)  # Insecure deserialization
EOF

# Create ZIP
cd ..
zip -r python-test.zip python-test/
```

### Example 2: JavaScript Project

```bash
mkdir js-test
cd js-test

cat > server.js << 'EOF'
const express = require('express');
const app = express();

app.get('/user', (req, res) => {
  res.send(`<h1>Hello ${req.query.name}</h1>`);  // XSS
});

const API_KEY = 'sk-1234567890';  // Hardcoded secret
EOF

cat > auth.js << 'EOF'
function generateToken() {
  return Math.random().toString(36);  // Insecure random
}
EOF

cd ..
zip -r js-test.zip js-test/
```

## 💡 Best Practices

1. **Clean Your Project First**
   - Remove `node_modules/`, `venv/`, etc. before zipping
   - This reduces ZIP size and upload time

2. **Focus on Source Code**
   - Only include your actual source code
   - Exclude build artifacts, dependencies, and generated files

3. **Test with Small Projects First**
   - Start with a small ZIP to understand the workflow
   - Then move to larger projects

4. **Use "Static" Mode for Quick Checks**
   - If you just want to see vulnerabilities without execution
   - Faster and doesn't use Daytona resources

5. **Use "Both" Mode for Thorough Analysis**
   - Best for production code
   - Detects both static patterns and runtime issues

## 🐛 Troubleshooting

### "No valid code files found in ZIP archive"

**Causes:**
- ZIP contains no supported file types
- All code files were filtered out (too large, in excluded dirs, etc.)
- Files have wrong extensions

**Solutions:**
- Check that ZIP contains `.py`, `.js`, `.ts`, etc. files
- Ensure files aren't in excluded directories like `node_modules/`
- Verify file extensions are correct

### "File size exceeds limit"

**Cause:** ZIP file is larger than 10MB

**Solutions:**
- Remove `node_modules/`, `venv/`, and other large directories
- Split your project into smaller parts
- Compress files with better compression

### "Upload failed" or "Extraction error"

**Causes:**
- Corrupted ZIP file
- Network issues
- Unsupported ZIP format

**Solutions:**
- Re-create the ZIP file
- Try a different ZIP tool
- Check your internet connection
- Verify ZIP file isn't corrupted (can you extract it locally?)

### Analysis is Slow

**For Dynamic Analysis:**
- Creating Daytona sandboxes takes time (~5-10 seconds per file)
- Uploading files to sandbox adds overhead
- Use "Static" mode if you don't need execution

**For AI Suggestions:**
- OpenAI API calls take 2-5 seconds per vulnerability
- Many vulnerabilities = longer wait
- AI suggestions are generated after analysis completes

## 📈 Tips for Large Projects

If you have a large project (100+ files):

1. **Analyze in Batches**
   - Create multiple smaller ZIPs
   - Analyze critical files first

2. **Use Static Mode**
   - Much faster for large codebases
   - Use Dynamic mode only for critical files

3. **Pre-filter Files**
   - Only include files you actually want to analyze
   - Remove test files, examples, etc.

4. **Monitor Costs**
   - Dynamic analysis uses Daytona resources
   - AI suggestions use OpenAI tokens
   - Check your usage dashboards

## 🔐 Security & Privacy

- **Temporary Processing**: Files are only kept in memory during analysis
- **Automatic Cleanup**: Daytona sandboxes are deleted after analysis
- **No Long-term Storage**: No code is stored permanently
- **Isolated Execution**: Code runs in secure, isolated Daytona containers

## 📞 Support

If you encounter issues with ZIP uploads:

1. Check file size and limits
2. Verify ZIP format and contents
3. Review browser console for errors
4. Try with a smaller test ZIP first
5. Open an issue on GitHub with details

---

Happy analyzing! 🛡️

For more information:
- [README.md](./README.md) - Complete documentation
- [EXAMPLES.md](./EXAMPLES.md) - Sample code to test
- [SETUP.md](./SETUP.md) - Setup instructions

