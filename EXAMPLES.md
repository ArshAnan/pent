# 📚 Code Examples for Testing

This document provides various code examples with different types of vulnerabilities that you can use to test the AI Code Security Analyzer.

## Python Examples

### Example 1: Multiple Critical Vulnerabilities

```python
import os
import pickle
import sqlite3

# Hardcoded credentials
DB_PASSWORD = "super_secret_123"
API_KEY = "sk-1234567890abcdef"

def search_user(username):
    # SQL Injection vulnerability
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    query = f"SELECT * FROM users WHERE username = '{username}'"
    cursor.execute(query)
    return cursor.fetchall()

def execute_command(user_input):
    # Command injection vulnerability
    os.system(f"ping {user_input}")

def load_config(config_data):
    # Insecure deserialization
    return pickle.loads(config_data)

# Execution
user = input("Enter username: ")
result = search_user(user)
print(result)
```

### Example 2: Weak Cryptography

```python
import hashlib
import random

def generate_token():
    # Insecure random for security token
    return str(random.random() * 1000000)

def hash_password(password):
    # Weak cryptographic algorithm
    return hashlib.md5(password.encode()).hexdigest()

def encrypt_data(data):
    # Another weak algorithm
    return hashlib.sha1(data.encode()).hexdigest()

password = "user_password"
hashed = hash_password(password)
token = generate_token()
```

### Example 3: Path Traversal

```python
import os

def read_file(filename):
    # Path traversal vulnerability
    path = "/var/www/uploads/" + filename
    with open(path, 'r') as f:
        return f.read()

def save_user_file(filename, content):
    # Unsafe file path construction
    filepath = "./uploads/" + filename
    with open(filepath, 'w') as f:
        f.write(content)

# User can access any file with ../../../etc/passwd
user_file = input("Enter filename: ")
content = read_file(user_file)
```

## JavaScript/Node.js Examples

### Example 1: XSS and Injection

```javascript
const express = require('express');
const { exec } = require('child_process');

const app = express();

// XSS vulnerability
app.get('/welcome', (req, res) => {
  const name = req.query.name;
  res.send(`<h1>Welcome ${name}</h1>`);
});

// Command injection
app.get('/ping', (req, res) => {
  const host = req.query.host;
  exec(`ping -c 4 ${host}`, (err, stdout) => {
    res.send(stdout);
  });
});

// Hardcoded secrets
const API_KEY = 'sk-abc123xyz789';
const DB_PASSWORD = 'admin123';

app.listen(3000);
```

### Example 2: Insecure Redirect and SSRF

```javascript
const express = require('express');
const axios = require('axios');

const app = express();

// Open redirect vulnerability
app.get('/redirect', (req, res) => {
  const url = req.query.url;
  res.redirect(url);
});

// SSRF vulnerability
app.get('/fetch', async (req, res) => {
  const url = req.query.url;
  const response = await axios.get(url);
  res.json(response.data);
});

// Eval usage (code injection)
app.post('/calculate', (req, res) => {
  const expression = req.body.expr;
  const result = eval(expression);
  res.json({ result });
});

app.listen(3000);
```

### Example 3: Client-Side Vulnerabilities

```javascript
// Insecure random for security purposes
function generateSessionId() {
  return Math.random().toString(36).substring(2);
}

// XSS via innerHTML
function displayUserComment(comment) {
  document.getElementById('comments').innerHTML = comment;
}

// Storing sensitive data in localStorage
function saveApiKey(apiKey) {
  localStorage.setItem('api_key', apiKey);
}

// No input validation
function processUserData(data) {
  fetch('/api/process', {
    method: 'POST',
    body: JSON.stringify({ data: data })
  });
}
```

## TypeScript Example

```typescript
import { exec } from 'child_process';
import * as crypto from 'crypto';

interface UserCredentials {
  username: string;
  password: string;
}

class AuthService {
  // Hardcoded secret
  private readonly SECRET_KEY = 'my-secret-key-123';
  
  // Weak crypto
  hashPassword(password: string): string {
    return crypto.createHash('md5').update(password).digest('hex');
  }
  
  // Command injection
  async runSystemCommand(cmd: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) reject(error);
        resolve(stdout);
      });
    });
  }
  
  // SQL injection (if using raw queries)
  async findUser(username: string): Promise<any> {
    const query = `SELECT * FROM users WHERE username = '${username}'`;
    // Execute query...
    return null;
  }
}
```

## Bash Example

```bash
#!/bin/bash

# Hardcoded credentials
API_KEY="sk-1234567890"
PASSWORD="admin123"

# Command injection vulnerability
USER_INPUT=$1
eval "ls -la $USER_INPUT"

# Insecure temp file
TEMP_FILE="/tmp/data.txt"
echo "sensitive data" > $TEMP_FILE

# Path traversal
FILE_NAME=$2
cat "/var/www/files/$FILE_NAME"

# No input validation
curl -X POST "https://api.example.com/data?input=$USER_INPUT"
```

## Go Example

```go
package main

import (
    "database/sql"
    "fmt"
    "os/exec"
)

// Hardcoded credentials
const (
    APIKey = "sk-1234567890"
    DBPassword = "admin123"
)

// SQL injection
func getUser(username string) error {
    db, _ := sql.Open("mysql", "user:password@/dbname")
    query := fmt.Sprintf("SELECT * FROM users WHERE username = '%s'", username)
    _, err := db.Query(query)
    return err
}

// Command injection
func pingHost(host string) error {
    cmd := exec.Command("ping", "-c", "4", host)
    return cmd.Run()
}

// Weak randomness for security token
func generateToken() string {
    return fmt.Sprintf("%d", rand.Int())
}
```

## Java Example

```java
import java.sql.*;
import java.io.*;

public class VulnerableApp {
    // Hardcoded credentials
    private static final String DB_PASSWORD = "admin123";
    private static final String API_KEY = "sk-1234567890";
    
    // SQL Injection
    public User getUserByName(String username) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost/db");
        Statement stmt = conn.createStatement();
        String query = "SELECT * FROM users WHERE username = '" + username + "'";
        ResultSet rs = stmt.executeQuery(query);
        return null;
    }
    
    // Command Injection
    public String executeCommand(String cmd) throws IOException {
        Runtime rt = Runtime.getRuntime();
        Process proc = rt.exec(cmd);
        return new String(proc.getInputStream().readAllBytes());
    }
    
    // Path Traversal
    public String readFile(String filename) throws IOException {
        File file = new File("/uploads/" + filename);
        return new String(Files.readAllBytes(file.toPath()));
    }
}
```

## Secure Code Examples (for comparison)

### Secure Python Example

```python
import os
import sqlite3
import secrets
import hashlib
from typing import Optional

# Use environment variables for secrets
API_KEY = os.getenv('API_KEY')
DB_PASSWORD = os.getenv('DB_PASSWORD')

def search_user_secure(username: str) -> Optional[list]:
    # Use parameterized queries
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    return cursor.fetchall()

def generate_secure_token() -> str:
    # Use cryptographically secure random
    return secrets.token_urlsafe(32)

def hash_password_secure(password: str) -> str:
    # Use strong algorithm (e.g., bcrypt or argon2)
    # This is simplified; use a proper library like bcrypt
    salt = secrets.token_bytes(32)
    return hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000).hex()
```

### Secure JavaScript Example

```javascript
const express = require('express');
const { body, query, validationResult } = require('express-validator');
const DOMPurify = require('isomorphic-dompurify');

const app = express();

// Secure route with validation and sanitization
app.get('/welcome',
  query('name').trim().escape(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const name = req.query.name;
    const clean = DOMPurify.sanitize(name);
    res.send(`<h1>Welcome ${clean}</h1>`);
  }
);

// Use environment variables
const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;

// Secure random token generation
const crypto = require('crypto');
function generateSecureToken() {
  return crypto.randomBytes(32).toString('hex');
}
```

## Testing Tips

1. **Start Simple**: Begin with the basic examples
2. **Test Each Type**: Try different vulnerability types
3. **Compare Results**: Use both vulnerable and secure versions
4. **Mix Vulnerabilities**: Combine multiple issues in one code sample
5. **Test Edge Cases**: Try obfuscated or complex code patterns
6. **Different Languages**: Test across all supported languages

## Expected Results

When you analyze these examples, you should see:

- **Critical vulnerabilities** for SQL injection, command injection, hardcoded secrets
- **High vulnerabilities** for XSS, path traversal, SSRF
- **Medium vulnerabilities** for weak crypto, open redirects
- **AI suggestions** with corrected code for each issue
- **Prevention tips** for avoiding similar vulnerabilities

---

Use these examples to understand what the analyzer can detect and to verify it's working correctly!

