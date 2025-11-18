'use client';

import { useState } from 'react';
import { PenTestResponse, SecuritySuggestion, MultiFilePenTestResponse, CodeFile } from '@/lib/types';

type AnalysisMode = 'single' | 'multi';

export default function Home() {
  const [mode, setMode] = useState<AnalysisMode>('single');
  
  // Single file state
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<string>('python');
  
  // Multi file state
  const [uploadedFiles, setUploadedFiles] = useState<CodeFile[]>([]);
  const [uploadedFilename, setUploadedFilename] = useState<string>('');
  
  // Common state
  const [testType, setTestType] = useState<'static' | 'dynamic' | 'both'>('both');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Results state
  const [results, setResults] = useState<PenTestResponse | null>(null);
  const [multiResults, setMultiResults] = useState<MultiFilePenTestResponse | null>(null);
  const [suggestions, setSuggestions] = useState<SecuritySuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const exampleCode = `# Example vulnerable Python code
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

# Execute with user input
user_data = input("Enter username: ")
result = process_user_input(user_data)
print(result)`;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      setError('Please upload a ZIP file');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadedFiles([]);
    setUploadedFilename('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      setUploadedFiles(data.files);
      setUploadedFilename(file.name);
      setError(null);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handlePenTest = async () => {
    if (!code.trim()) {
      setError('Please enter some code to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setMultiResults(null);
    setSuggestions([]);

    try {
      const pentestResponse = await fetch('/api/pentest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, testType })
      });

      if (!pentestResponse.ok) {
        const errorData = await pentestResponse.json();
        throw new Error(errorData.error || 'Pen test failed');
      }

      const pentestData: PenTestResponse = await pentestResponse.json();
      setResults(pentestData);

      if (pentestData.report.vulnerabilities.length > 0) {
        setAnalyzing(true);
        
        const suggestResponse = await fetch('/api/suggest-fixes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            vulnerabilities: pentestData.report.vulnerabilities,
            language
          })
        });

        if (suggestResponse.ok) {
          const suggestData = await suggestResponse.json();
          setSuggestions(suggestData.suggestions || []);
          
          setResults({
            ...pentestData,
            suggestions: suggestData.suggestions || []
          });
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Pen test error:', err);
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const handleMultiPenTest = async () => {
    if (uploadedFiles.length === 0) {
      setError('Please upload a ZIP file first');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setMultiResults(null);

    try {
      const pentestResponse = await fetch('/api/pentest-multi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: uploadedFiles, testType })
      });

      if (!pentestResponse.ok) {
        const errorData = await pentestResponse.json();
        throw new Error(errorData.error || 'Multi-file pen test failed');
      }

      const pentestData: MultiFilePenTestResponse = await pentestResponse.json();
      setMultiResults(pentestData);

      if (pentestData.totalVulnerabilities > 0) {
        setAnalyzing(true);
        
        const suggestResponse = await fetch('/api/suggest-fixes-multi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            files: pentestData.files,
            originalFiles: uploadedFiles
          })
        });

        if (suggestResponse.ok) {
          const suggestData = await suggestResponse.json();
          setMultiResults({
            ...pentestData,
            files: suggestData.files || pentestData.files
          });
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Multi-file pen test error:', err);
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const loadExample = () => {
    setCode(exampleCode);
    setLanguage('python');
    setMode('single');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-black text-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">AI Security Analyzer</h1>
              <p className="text-sm text-neutral-300">Penetration Testing + Vulnerability Detection + AI Fixes</p>
            </div>
            <button
              onClick={loadExample}
              className="px-4 py-2 bg-white text-black hover:bg-neutral-200 font-medium text-sm transition-colors"
            >
              Load Example
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Mode Selector */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('single')}
            className={`flex-1 py-3 px-6 font-medium transition-colors ${
              mode === 'single'
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-neutral-100 border-2 border-black'
            }`}
          >
            Code Editor
          </button>
          <button
            onClick={() => setMode('multi')}
            className={`flex-1 py-3 px-6 font-medium transition-colors ${
              mode === 'multi'
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-neutral-100 border-2 border-black'
            }`}
          >
            ZIP Upload
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Input */}
          <div className="space-y-4">
            {mode === 'single' ? (
              <SingleFileInput 
                code={code}
                setCode={setCode}
                language={language}
                setLanguage={setLanguage}
              />
            ) : (
              <MultiFileInput
                uploading={uploading}
                handleFileUpload={handleFileUpload}
                uploadedFilename={uploadedFilename}
                uploadedFiles={uploadedFiles}
              />
            )}

            {/* Analysis Type */}
            <div className="bg-white border-2 border-black p-6">
              <label className="block text-sm font-bold mb-3 uppercase tracking-wide">
                Analysis Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['static', 'dynamic', 'both'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setTestType(type)}
                    className={`py-2 px-4 font-medium text-sm transition-colors ${
                      testType === type
                        ? 'bg-black text-white'
                        : 'bg-neutral-100 text-black hover:bg-neutral-200'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
              <p className="text-xs mt-3 text-neutral-600">
                Static: Fast pattern scan | Dynamic: Daytona sandbox | Both: Complete analysis
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={mode === 'single' ? handlePenTest : handleMultiPenTest}
              disabled={loading || analyzing || (mode === 'multi' && uploadedFiles.length === 0)}
              className="w-full bg-black text-white py-4 px-6 font-bold text-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black"
            >
              {loading ? 'Analyzing...' : analyzing ? 'Generating Fixes...' : 'Run Security Analysis'}
            </button>
          </div>

          {/* Right Panel - Results */}
          <div className="bg-white border-2 border-black min-h-[600px]">
            <div className="bg-black text-white px-6 py-4 border-b-2 border-black">
              <h2 className="font-bold text-lg">Analysis Results</h2>
            </div>
            
            <div className="p-6">
              {error && (
                <div className="bg-white border-2 border-black p-4 mb-4">
                  <div className="font-bold mb-2 text-sm">ERROR</div>
                  <div className="text-sm">{error}</div>
                </div>
              )}

              {!results && !multiResults && !error && (
                <div className="flex flex-col items-center justify-center h-96 text-center text-neutral-400">
                  <div className="text-6xl mb-4">◻</div>
                  <div className="font-medium mb-2">No Analysis Yet</div>
                  <div className="text-sm">Run security analysis to see results</div>
                </div>
              )}

              {results && mode === 'single' && (
                <SingleFileResults 
                  results={results} 
                  suggestions={suggestions}
                />
              )}

              {multiResults && mode === 'multi' && (
                <MultiFileResults results={multiResults} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-black mt-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-xs text-neutral-600">
          Powered by Daytona Sandboxes + OpenAI GPT-4 | Built with Next.js + TypeScript
        </div>
      </footer>
    </div>
  );
}

// Single File Input Component
function SingleFileInput({ code, setCode, language, setLanguage }: any) {
  return (
    <>
      <div className="bg-white border-2 border-black p-6">
        <label className="block text-sm font-bold mb-3 uppercase tracking-wide">
          Language
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full px-4 py-3 border-2 border-black bg-white font-medium hover:border-neutral-600 transition-colors"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="bash">Bash</option>
          <option value="go">Go</option>
          <option value="java">Java</option>
        </select>
      </div>

      <div className="bg-white border-2 border-black p-6">
        <label className="block text-sm font-bold mb-3 uppercase tracking-wide">
          Source Code
        </label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here..."
          className="w-full h-96 px-4 py-3 border-2 border-black bg-neutral-50 resize-none text-sm focus:bg-white transition-colors"
          spellCheck={false}
        />
      </div>
    </>
  );
}

// Multi File Input Component
function MultiFileInput({ uploading, handleFileUpload, uploadedFilename, uploadedFiles }: any) {
  return (
    <>
      <div className="bg-white border-2 border-black p-6">
        <label className="block text-sm font-bold mb-3 uppercase tracking-wide">
          Upload ZIP File
        </label>
        <div className="border-2 border-dashed border-black p-12 text-center hover:bg-neutral-50 transition-colors cursor-pointer">
          <input
            type="file"
            accept=".zip"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={uploading}
          />
          <label htmlFor="file-upload" className="cursor-pointer block">
            <div className="text-5xl mb-4">↓</div>
            <div className="font-bold mb-2">
              {uploading ? 'Uploading...' : 'Click to Upload ZIP'}
            </div>
            <div className="text-xs text-neutral-600">
              Max 250MB | Python, JS, TS, Bash, Go, Java
            </div>
          </label>
        </div>

        {uploadedFilename && (
          <div className="mt-4 bg-neutral-50 border-2 border-black p-4">
            <div className="font-bold text-sm mb-1">✓ Uploaded</div>
            <div className="text-sm truncate mb-1">{uploadedFilename}</div>
            <div className="text-xs text-neutral-600">{uploadedFiles.length} files extracted</div>
          </div>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="bg-white border-2 border-black p-6">
          <div className="text-sm font-bold mb-3 uppercase tracking-wide">
            Files to Analyze ({uploadedFiles.length})
          </div>
          <div className="max-h-64 overflow-y-auto space-y-1">
            {uploadedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 px-3 bg-neutral-50 hover:bg-neutral-100 transition-colors">
                <span className="text-xs truncate flex-1">{file.filename}</span>
                <span className="text-xs ml-2 px-2 py-1 bg-black text-white">
                  {file.language.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// Single File Results Component
function SingleFileResults({ results, suggestions }: any) {
  const getRiskStyles = (level: string) => {
    const styles: Record<string, string> = {
      critical: 'border-4 border-black bg-white',
      high: 'border-[3px] border-black bg-white',
      medium: 'border-2 border-black bg-white',
      low: 'border border-black bg-neutral-50'
    };
    return styles[level] || 'border border-black bg-white';
  };

  return (
    <div className="space-y-6 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
      {/* Risk Level */}
      <div className={`${getRiskStyles(results.report.riskLevel)} p-6`}>
        <div className="text-xs font-bold mb-2 uppercase tracking-wide text-neutral-600">Risk Level</div>
        <div className="text-4xl font-bold mb-3">{results.report.riskLevel.toUpperCase()}</div>
        <div className="text-sm">
          {results.report.vulnerabilities.length} {results.report.vulnerabilities.length === 1 ? 'vulnerability' : 'vulnerabilities'} detected
        </div>
      </div>

      {/* Vulnerabilities */}
      {results.report.vulnerabilities.length > 0 && (
        <div>
          <h3 className="text-sm font-bold mb-4 uppercase tracking-wide">Vulnerabilities</h3>
          <div className="space-y-3">
            {results.report.vulnerabilities.map((vuln: any, idx: number) => (
              <div key={idx} className="bg-white border-2 border-black p-4 hover:bg-neutral-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-bold text-sm">{vuln.type}</div>
                  <div className="text-xs px-2 py-1 bg-black text-white ml-2 whitespace-nowrap">
                    {vuln.severity.toUpperCase()}
                  </div>
                </div>
                <div className="text-xs text-neutral-700 mb-2">{vuln.description}</div>
                {vuln.location && (
                  <div className="text-xs text-neutral-500">📍 {vuln.location}</div>
                )}
                {vuln.cwe && (
                  <div className="text-xs text-neutral-500 mt-1">{vuln.cwe}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div>
          <h3 className="text-sm font-bold mb-4 uppercase tracking-wide">AI-Powered Fixes</h3>
          <div className="space-y-4">
            {suggestions.map((suggestion: any, idx: number) => (
              <div key={idx} className="bg-neutral-50 border-2 border-black p-4">
                <div className="font-bold text-sm mb-3">{suggestion.vulnerability.type}</div>
                
                <div className="mb-3">
                  <div className="text-xs font-bold mb-1 text-neutral-600">EXPLANATION</div>
                  <div className="text-xs">{suggestion.explanation}</div>
                </div>

                {suggestion.fixedCode && (
                  <div className="mb-3">
                    <div className="text-xs font-bold mb-2 text-neutral-600">FIXED CODE</div>
                    <pre className="bg-black text-white p-3 text-xs overflow-x-auto border-2 border-black">
{suggestion.fixedCode}
                    </pre>
                  </div>
                )}

                {suggestion.preventionTips.length > 0 && (
                  <div>
                    <div className="text-xs font-bold mb-2 text-neutral-600">PREVENTION TIPS</div>
                    <ul className="text-xs space-y-1">
                      {suggestion.preventionTips.map((tip: string, tipIdx: number) => (
                        <li key={tipIdx} className="flex gap-2">
                          <span>•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clean Result */}
      {results.report.vulnerabilities.length === 0 && (
        <div className="border-2 border-black p-8 text-center bg-white">
          <div className="text-5xl mb-4">✓</div>
          <div className="font-bold text-xl mb-2">Code Secure</div>
          <div className="text-sm text-neutral-600">No vulnerabilities detected</div>
        </div>
      )}
    </div>
  );
}

// Multi File Results Component
function MultiFileResults({ results }: any) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  
  const selectedFileData = selectedFile 
    ? results.files.find((f: any) => f.filename === selectedFile)
    : null;

  const getRiskStyles = (level: string) => {
    const styles: Record<string, string> = {
      critical: 'border-4 border-black',
      high: 'border-[3px] border-black',
      medium: 'border-2 border-black',
      low: 'border border-black'
    };
    return styles[level] || 'border border-black';
  };

  return (
    <div className="space-y-6 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
      {/* Overall Stats */}
      <div className={`${getRiskStyles(results.overallRiskLevel)} p-6 bg-white`}>
        <div className="text-xs font-bold mb-2 uppercase tracking-wide text-neutral-600">Overall Risk</div>
        <div className="text-4xl font-bold mb-4">{results.overallRiskLevel.toUpperCase()}</div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-neutral-600 mb-1">Files</div>
            <div className="text-2xl font-bold">{results.files.length}</div>
          </div>
          <div>
            <div className="text-neutral-600 mb-1">Issues</div>
            <div className="text-2xl font-bold">{results.totalVulnerabilities}</div>
          </div>
        </div>
      </div>

      {/* Files List */}
      <div>
        <h3 className="text-sm font-bold mb-3 uppercase tracking-wide">Files Analyzed</h3>
        <div className="space-y-2">
          {results.files.map((file: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setSelectedFile(file.filename)}
              className={`w-full text-left p-4 border-2 border-black transition-colors ${
                selectedFile === file.filename
                  ? 'bg-black text-white'
                  : 'bg-white hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate mb-1">{file.filename}</div>
                  <div className="text-xs opacity-75">
                    {file.report.vulnerabilities.length} issues · {file.language}
                  </div>
                </div>
                <div className={`text-xs px-3 py-1 border whitespace-nowrap ${
                  selectedFile === file.filename ? 'border-white' : 'border-black'
                }`}>
                  {file.report.riskLevel.toUpperCase()}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected File Details */}
      {selectedFileData && (
        <div className="border-t-4 border-black pt-6">
          <h3 className="text-sm font-bold mb-4 uppercase tracking-wide">File Details</h3>
          <div className="text-sm font-bold mb-4 truncate">{selectedFileData.filename}</div>
          
          {selectedFileData.report.vulnerabilities.length > 0 ? (
            <>
              <div className="space-y-3 mb-6">
                {selectedFileData.report.vulnerabilities.map((vuln: any, idx: number) => (
                  <div key={idx} className="bg-white border-2 border-black p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-bold text-xs">{vuln.type}</div>
                      <div className="text-xs px-2 py-1 bg-black text-white ml-2">
                        {vuln.severity.toUpperCase()}
                      </div>
                    </div>
                    <div className="text-xs text-neutral-700">{vuln.description}</div>
                  </div>
                ))}
              </div>

              {selectedFileData.suggestions && selectedFileData.suggestions.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold mb-3 uppercase tracking-wide">AI Fixes</h4>
                  <div className="space-y-3">
                    {selectedFileData.suggestions.map((suggestion: any, idx: number) => (
                      <div key={idx} className="bg-neutral-50 border-2 border-black p-3">
                        <div className="font-bold text-xs mb-2">{suggestion.vulnerability.type}</div>
                        
                        <div className="mb-2">
                          <div className="text-xs opacity-60 mb-1">Explanation</div>
                          <div className="text-xs">{suggestion.explanation}</div>
                        </div>

                        {suggestion.fixedCode && (
                          <div>
                            <div className="text-xs opacity-60 mb-1">Fixed Code</div>
                            <pre className="bg-black text-white p-2 text-xs overflow-x-auto max-h-32">
{suggestion.fixedCode}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="border-2 border-black p-6 text-center bg-white">
              <div className="text-3xl mb-2">✓</div>
              <div className="font-bold text-sm">No vulnerabilities</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
