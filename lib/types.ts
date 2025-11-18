export interface VulnerabilityReport {
  vulnerabilities: Vulnerability[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  executionOutput?: string;
  executionError?: string;
}

export interface Vulnerability {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location?: string;
  cwe?: string; // Common Weakness Enumeration
}

export interface SecuritySuggestion {
  vulnerability: Vulnerability;
  suggestedFix: string;
  fixedCode?: string;
  explanation: string;
  preventionTips: string[];
}

export interface PenTestRequest {
  code: string;
  language: 'python' | 'javascript' | 'typescript' | 'bash' | 'go' | 'java';
  testType?: 'static' | 'dynamic' | 'both';
}

export interface MultiFilePenTestRequest {
  files: CodeFile[];
  testType?: 'static' | 'dynamic' | 'both';
}

export interface CodeFile {
  filename: string;
  content: string;
  language: 'python' | 'javascript' | 'typescript' | 'bash' | 'go' | 'java' | 'unknown';
}

export interface FileAnalysisResult {
  filename: string;
  language: string;
  report: VulnerabilityReport;
  suggestions: SecuritySuggestion[];
}

export interface PenTestResponse {
  report: VulnerabilityReport;
  suggestions: SecuritySuggestion[];
  sandboxId?: string;
  timestamp: string;
}

export interface MultiFilePenTestResponse {
  files: FileAnalysisResult[];
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  totalVulnerabilities: number;
  sandboxId?: string;
  timestamp: string;
}

