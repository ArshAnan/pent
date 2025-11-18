# Contributing to AI Code Security Analyzer

Thank you for considering contributing to the AI Code Security Analyzer! This document provides guidelines and instructions for contributing.

## 🎯 Ways to Contribute

- **Report Bugs**: Open an issue describing the bug
- **Suggest Features**: Propose new features or enhancements
- **Improve Documentation**: Fix typos, clarify instructions, add examples
- **Add Vulnerability Patterns**: Extend the detection capabilities
- **Code Contributions**: Submit pull requests with new features or fixes

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/pent.git
   cd pent
   ```
3. **Set up the development environment**:
   ```bash
   npm install
   cp .env.example .env.local
   # Add your API keys to .env.local
   ```
4. **Verify setup**:
   ```bash
   npm run verify
   ```
5. **Run the development server**:
   ```bash
   npm run dev
   ```

## 📝 Code Style

- **TypeScript**: Use TypeScript for all new code
- **Formatting**: Run `npm run lint` before committing
- **Comments**: Add JSDoc comments for functions and classes
- **Naming**: Use descriptive variable and function names

## 🔍 Adding New Vulnerability Patterns

To add a new vulnerability detection pattern:

1. **Edit** `lib/vulnerability-checks.ts`
2. **Add your pattern** to `VULNERABILITY_PATTERNS`:
   ```typescript
   YOUR_VULNERABILITY: {
     pattern: /your-regex-here/gi,
     type: 'Your Vulnerability Name',
     severity: 'low' | 'medium' | 'high' | 'critical',
     cwe: 'CWE-XXX'
   }
   ```
3. **Test** your pattern with sample code
4. **Update documentation** if needed

### Example Pattern

```typescript
BUFFER_OVERFLOW: {
  pattern: /(strcpy|strcat|gets|sprintf)\s*\(/gi,
  type: 'Potential Buffer Overflow',
  severity: 'high' as const,
  cwe: 'CWE-120'
}
```

## 🧪 Testing

Before submitting a pull request:

1. **Test manually** with various code samples
2. **Check for linting errors**: `npm run lint`
3. **Verify build**: `npm run build`
4. **Test both static and dynamic analysis**

## 📋 Pull Request Process

1. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Make your changes** with clear, descriptive commits
3. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
4. **Open a Pull Request** on GitHub
5. **Describe your changes** clearly in the PR description
6. **Link related issues** if applicable

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Changes are documented
- [ ] No linting errors
- [ ] Tested manually
- [ ] PR description is clear and complete

## 🐛 Reporting Bugs

When reporting bugs, please include:

- **Description**: Clear description of the bug
- **Steps to Reproduce**: How to reproduce the issue
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Environment**:
  - OS and version
  - Node.js version
  - Browser (if applicable)
- **Screenshots**: If relevant
- **Logs**: Any error messages or console output

## 💡 Suggesting Features

For feature requests, please provide:

- **Use Case**: Why this feature would be useful
- **Description**: Detailed explanation of the feature
- **Examples**: How it would work
- **Alternatives**: Other solutions you've considered

## 🔐 Security Vulnerabilities

If you discover a security vulnerability:

1. **DO NOT** open a public issue
2. **Email** the maintainers directly
3. **Provide details** about the vulnerability
4. **Wait for response** before public disclosure

## 📚 Documentation

When contributing documentation:

- Use clear, concise language
- Include code examples where helpful
- Update the README if changing functionality
- Keep SETUP.md in sync with setup process

## 🎨 UI/UX Improvements

For UI/UX contributions:

- Follow existing design patterns
- Ensure responsive design (mobile, tablet, desktop)
- Test across different browsers
- Consider accessibility

## 🌐 Language Support

To add support for a new programming language:

1. **Update** `lib/types.ts` with the new language
2. **Add** language configuration in `app/api/pentest/route.ts`:
   ```typescript
   yourlang: { extension: 'ext', command: 'cmd {file}' }
   ```
3. **Test** with sample code in that language
4. **Document** any language-specific requirements

## 📊 Performance Optimization

When optimizing performance:

- Profile before and after changes
- Consider API rate limits and costs
- Test with large code samples
- Document performance improvements

## 🤝 Code Review

All contributions will be reviewed for:

- **Code Quality**: Readability, maintainability
- **Functionality**: Does it work as intended?
- **Security**: No new vulnerabilities introduced
- **Performance**: No significant performance degradation
- **Documentation**: Adequate documentation provided

## 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

## ❓ Questions?

If you have questions about contributing:

- Check existing issues and discussions
- Open a new issue with the "question" label
- Reach out to maintainers

## 🙏 Thank You!

Every contribution, no matter how small, helps make this project better. Thank you for your time and effort!

---

**Happy Contributing! 🚀**

