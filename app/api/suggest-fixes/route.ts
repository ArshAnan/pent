import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { SecuritySuggestion, Vulnerability } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, vulnerabilities, language } = body;

    if (!code || !vulnerabilities || !language) {
      return NextResponse.json(
        { error: 'Code, vulnerabilities, and language are required' },
        { status: 400 }
      );
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY not configured' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: openaiApiKey
    });

    const suggestions: SecuritySuggestion[] = [];

    // Process each vulnerability
    for (const vulnerability of vulnerabilities as Vulnerability[]) {
      try {
        const prompt = `You are a security expert analyzing code vulnerabilities. 

ORIGINAL CODE (${language}):
\`\`\`${language}
${code}
\`\`\`

VULNERABILITY DETECTED:
- Type: ${vulnerability.type}
- Severity: ${vulnerability.severity}
- Description: ${vulnerability.description}
- Location: ${vulnerability.location || 'Unknown'}
${vulnerability.cwe ? `- CWE: ${vulnerability.cwe}` : ''}

Please provide:
1. A detailed explanation of why this is a security issue
2. A corrected version of the COMPLETE code with the vulnerability fixed
3. Prevention tips to avoid this vulnerability in the future

Format your response as JSON with these fields:
{
  "explanation": "detailed explanation",
  "fixedCode": "complete corrected code",
  "preventionTips": ["tip1", "tip2", "tip3"]
}`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are a cybersecurity expert specializing in secure coding practices. Always provide complete, working code solutions. Return only valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' }
        });

        const responseContent = completion.choices[0]?.message?.content;
        if (!responseContent) {
          throw new Error('No response from OpenAI');
        }

        const aiResponse = JSON.parse(responseContent);

        suggestions.push({
          vulnerability,
          suggestedFix: aiResponse.explanation || 'No fix available',
          fixedCode: aiResponse.fixedCode,
          explanation: aiResponse.explanation || '',
          preventionTips: aiResponse.preventionTips || []
        });

      } catch (aiError) {
        console.error('OpenAI error for vulnerability:', vulnerability.type, aiError);
        
        // Provide a fallback suggestion
        suggestions.push({
          vulnerability,
          suggestedFix: getFallbackSuggestion(vulnerability),
          explanation: `Failed to generate AI suggestion: ${aiError instanceof Error ? aiError.message : 'Unknown error'}`,
          preventionTips: [
            'Review the OWASP Top 10 security risks',
            'Implement input validation and sanitization',
            'Follow the principle of least privilege',
            'Keep dependencies up to date'
          ]
        });
      }
    }

    return NextResponse.json({ suggestions });

  } catch (error) {
    console.error('Suggest fixes error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate security suggestions',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

function getFallbackSuggestion(vulnerability: Vulnerability): string {
  const suggestions: Record<string, string> = {
    'SQL/Command Injection': 'Use parameterized queries or prepared statements. Never concatenate user input directly into SQL queries or shell commands.',
    'Cross-Site Scripting (XSS)': 'Sanitize and escape all user input before rendering. Use Content Security Policy (CSP) headers. Avoid using innerHTML or dangerouslySetInnerHTML with user data.',
    'Hardcoded Credentials': 'Store credentials in environment variables or a secure secrets manager. Never commit sensitive data to version control.',
    'Path Traversal': 'Validate and sanitize file paths. Use allowlists for permitted paths. Implement proper access controls.',
    'Insecure Deserialization': 'Validate data before deserialization. Use safe alternatives like JSON. Implement integrity checks.',
    'Weak Cryptography': 'Use modern cryptographic algorithms (AES-256, SHA-256+). Implement proper key management. Use TLS 1.2+ for network communications.',
    'Open Redirect': 'Validate redirect URLs against an allowlist. Avoid using user input directly in redirect functions.',
    'Insufficient Input Validation': 'Implement strict input validation. Use allowlists over denylists. Sanitize all user input.',
    'Insecure Randomness': 'Use cryptographically secure random number generators (crypto.randomBytes, secrets module).',
    'Server-Side Request Forgery (SSRF)': 'Validate and sanitize URLs. Implement allowlists for permitted domains. Use network segmentation.'
  };

  return suggestions[vulnerability.type] || 'Review security best practices for this vulnerability type. Consult OWASP guidelines.';
}

