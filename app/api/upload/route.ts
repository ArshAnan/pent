import { NextRequest, NextResponse } from 'next/server';
import AdmZip from 'adm-zip';
import { CodeFile } from '@/lib/types';
import { detectLanguageFromFilename, isCodeFile, MAX_FILE_SIZE, MAX_FILES } from '@/lib/file-utils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds limit of ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Check if it's a ZIP file
    if (!file.name.endsWith('.zip')) {
      return NextResponse.json(
        { error: 'Only ZIP files are supported' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract ZIP contents
    const zip = new AdmZip(buffer);
    const zipEntries = zip.getEntries();

    const codeFiles: CodeFile[] = [];

    for (const entry of zipEntries) {
      // Skip directories
      if (entry.isDirectory) {
        continue;
      }

      const filename = entry.entryName;

      // Only process code files
      if (!isCodeFile(filename)) {
        continue;
      }

      // Check if we've reached the max files limit
      if (codeFiles.length >= MAX_FILES) {
        console.log(`Reached max files limit (${MAX_FILES}), skipping remaining files`);
        break;
      }

      try {
        // Get file content as string
        const content = entry.getData().toString('utf8');
        
        // Skip empty files
        if (!content.trim()) {
          continue;
        }

        // Detect language
        const language = detectLanguageFromFilename(filename);
        
        // Skip unknown language files
        if (language === 'unknown') {
          continue;
        }

        codeFiles.push({
          filename,
          content,
          language
        });

      } catch (err) {
        console.error(`Error processing file ${filename}:`, err);
        // Continue with other files
      }
    }

    if (codeFiles.length === 0) {
      return NextResponse.json(
        { error: 'No valid code files found in ZIP archive' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      files: codeFiles,
      totalFiles: codeFiles.length,
      message: `Extracted ${codeFiles.length} code file(s) from ZIP archive`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process ZIP file',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Configure the route to accept larger payloads
// In Next.js App Router, body size limits are configured in next.config.ts
// This export is not needed in App Router

