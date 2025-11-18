import { CodeFile } from './types';

/**
 * Detects programming language from file extension
 */
export function detectLanguageFromFilename(filename: string): CodeFile['language'] {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  const languageMap: Record<string, CodeFile['language']> = {
    'py': 'python',
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'sh': 'bash',
    'bash': 'bash',
    'go': 'go',
    'java': 'java',
  };

  return languageMap[extension] || 'unknown';
}

/**
 * Filters files to only include code files
 */
export function isCodeFile(filename: string): boolean {
  const codeExtensions = ['py', 'js', 'jsx', 'ts', 'tsx', 'sh', 'bash', 'go', 'java'];
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  // Skip common non-code files
  const skipFiles = [
    'package-lock.json',
    'package.json',
    'tsconfig.json',
    '.gitignore',
    '.env',
    'README.md',
    'LICENSE',
  ];
  
  const basename = filename.split('/').pop() || '';
  if (skipFiles.includes(basename)) {
    return false;
  }

  // Skip hidden files and directories
  if (basename.startsWith('.')) {
    return false;
  }

  // Skip node_modules and common directories
  if (filename.includes('node_modules/') || 
      filename.includes('__pycache__/') ||
      filename.includes('.git/') ||
      filename.includes('dist/') ||
      filename.includes('build/')) {
    return false;
  }

  return codeExtensions.includes(extension);
}

/**
 * Get file size in a readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get max file size limit (250MB)
 */
export const MAX_FILE_SIZE = 250 * 1024 * 1024; // 250MB

/**
 * Get max number of files to analyze
 */
export const MAX_FILES = 50;

