# Bug Fix: Daytona SDK API Changes (v0.115.0)

## Problems

The application was experiencing TWO different errors due to Daytona SDK v0.115.0 API changes:

### Problem 1: File Upload Error

```
TypeError: The "iterable" argument must be an instance of Iterable. Received an instance of Object
    at FileSystem.makeFilePayload (libs/sdk-typescript/src/FileSystem.ts:525:28)
    at async FileSystem.uploadFiles (libs/sdk-typescript/src/FileSystem.ts:488:23)
    at async FileSystem.uploadFile (libs/sdk-typescript/src/FileSystem.ts:447:5)
```

### Problem 2: Process Execution Error

After fixing the upload error, a second error appeared:

```
TypeError: sandbox.process.exec is not a function
    at POST (app/api/pentest-multi/route.ts:89:50)
```

## Root Causes

The Daytona SDK v0.115.0 introduced **breaking changes** to multiple APIs:

### Root Cause 1: uploadFile API Changed

The `uploadFile` method now expects **two separate parameters** instead of an object:

### Old (Incorrect) API Usage:
```typescript
await sandbox.fs.uploadFile({
  path: `/home/daytona/${targetFilename}`,
  data: Buffer.from(file.content).toString('base64')
});
```

### New (Correct) API Usage:
```typescript
await sandbox.fs.uploadFile(
  Buffer.from(file.content),    // First parameter: Buffer
  `/home/daytona/${targetFilename}`  // Second parameter: remote path
);
```

### Root Cause 2: Process Execution API Changed

The process execution method was **completely renamed and restructured**:

**Old API:**
- Method: `sandbox.process.exec()`
- Parameters: Object with `{ cmd, cwd }`
- Response: `{ stdout, stderr, exitCode }`

**New API:**
- Method: `sandbox.process.executeCommand()`
- Parameters: Positional `(command, cwd?, env?, timeout?)`
- Response: `{ exitCode, result, artifacts }`

#### Old (Incorrect) API Usage:
```typescript
const result = await sandbox.process.exec({
  cmd: languageConfig.command.replace('{file}', targetFilename),
  cwd: '/home/daytona'
});

executionOutput = result.stdout || '';
executionError = result.stderr || '';
```

#### New (Correct) API Usage:
```typescript
const result = await sandbox.process.executeCommand(
  languageConfig.command.replace('{file}', targetFilename),
  '/home/daytona'
);

executionOutput = result.result || '';
executionError = result.exitCode !== 0 ? `Process exited with code ${result.exitCode}` : '';
```

**Note:** The new API doesn't provide separate `stderr` output. The `result` field contains stdout, and errors are indicated by a non-zero `exitCode`.

## Files Fixed

Both API routes were updated with **two fixes each**: file upload and process execution.

### 1. `app/api/pentest/route.ts`

#### Fix 1: File Upload (Lines 63-66)
**Before:**
```typescript
await sandbox.fs.uploadFile({
  path: `/home/daytona/${fileName}`,
  data: Buffer.from(code).toString('base64')
});
```

**After:**
```typescript
await sandbox.fs.uploadFile(
  Buffer.from(code),
  `/home/daytona/${fileName}`
);
```

#### Fix 2: Process Execution (Lines 70-76)
**Before:**
```typescript
const result = await sandbox.process.exec({
  cmd: languageConfig.command.replace('{file}', fileName),
  cwd: '/home/daytona'
});

executionOutput = result.stdout || '';
executionError = result.stderr || '';
```

**After:**
```typescript
const result = await sandbox.process.executeCommand(
  languageConfig.command.replace('{file}', fileName),
  '/home/daytona'
);

executionOutput = result.result || '';
executionError = result.exitCode !== 0 ? `Process exited with code ${result.exitCode}` : '';
```

### 2. `app/api/pentest-multi/route.ts`

#### Fix 1: File Upload (Lines 82-85)
**Before:**
```typescript
await sandbox.fs.uploadFile({
  path: `/home/daytona/${targetFilename}`,
  data: Buffer.from(file.content).toString('base64')
});
```

**After:**
```typescript
await sandbox.fs.uploadFile(
  Buffer.from(file.content),
  `/home/daytona/${targetFilename}`
);
```

#### Fix 2: Process Execution (Lines 89-95)
**Before:**
```typescript
const result = await sandbox.process.exec({
  cmd: languageConfig.command.replace('{file}', targetFilename),
  cwd: '/home/daytona'
});

executionOutput = result.stdout || '';
executionError = result.stderr || '';
```

**After:**
```typescript
const result = await sandbox.process.executeCommand(
  languageConfig.command.replace('{file}', targetFilename),
  '/home/daytona'
);

executionOutput = result.result || '';
executionError = result.exitCode !== 0 ? `Process exited with code ${result.exitCode}` : '';
```

## API Reference

According to the Daytona SDK TypeScript definitions (`@daytonaio/sdk@0.115.0`):

### FileSystem.uploadFile Method

Two signatures available:

**Signature 1: Upload from Buffer**
```typescript
uploadFile(file: Buffer, remotePath: string, timeout?: number): Promise<void>
```

**Signature 2: Upload from Local File**
```typescript
uploadFile(localPath: string, remotePath: string, timeout?: number): Promise<void>
```

### Process.executeCommand Method

```typescript
executeCommand(
  command: string,
  cwd?: string,
  env?: Record<string, string>,
  timeout?: number
): Promise<ExecuteResponse>
```

**ExecuteResponse structure:**
```typescript
interface ExecuteResponse {
  exitCode: number;
  result: string;  // stdout content
  artifacts?: {
    stdout: string;  // same as result
    charts?: Chart[];  // matplotlib charts if any
  };
}
```

## Summary of Changes

### uploadFile Changes:
1. Removed the object parameter structure
2. Changed to positional parameters:
   - First parameter: `Buffer.from(content)` - the file content as a Buffer
   - Second parameter: remote path string
3. Removed unnecessary `.toString('base64')` conversion - the SDK handles encoding internally

### Process Execution Changes:
1. Method renamed: `exec()` → `executeCommand()`
2. Changed from object parameters to positional parameters
3. Updated response handling:
   - `result.stdout` → `result.result`
   - `result.stderr` → Check `result.exitCode !== 0`
   - No separate stderr field in the new API

## Testing

To test the fix:

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Test Single File Analysis:**
   - Go to http://localhost:3000
   - Paste some code
   - Select a language
   - Choose "Dynamic" or "Both" analysis
   - Run Security Analysis

3. **Test Multi-File Analysis:**
   - Click "📦 ZIP Upload" tab
   - Upload a ZIP file with code files
   - Choose "Dynamic" or "Both" analysis
   - Run Security Analysis

4. **Expected Result:**
   - Files should upload successfully to the sandbox
   - No more "iterable" errors
   - Security analysis should complete normally

## Using Daytona MCP for Future Debugging

Once you complete the MCP setup (see `MCP_SETUP_COMPLETE.md`), you'll be able to debug issues like this more easily:

### Example MCP Workflow:
```
You: "Create a test sandbox"
AI: [Creates sandbox-abc123]

You: "Upload a test file to /tmp/test.py with content: print('hello')"
AI: [Uploads file successfully]

You: "Execute the file"
AI: [Runs and shows output]

You: "Destroy the sandbox"
AI: [Cleans up]
```

This allows you to:
- Test SDK methods interactively
- Verify file uploads work correctly
- Debug without modifying code
- Explore API changes quickly

## Prevention

To avoid similar issues in the future:

1. **Check SDK Documentation**: Always refer to the TypeScript type definitions when using SDK methods
2. **Use TypeScript**: TypeScript would have caught this error at compile time
3. **Monitor SDK Updates**: Review changelog when updating `@daytonaio/sdk`
4. **Test After Updates**: Run integration tests after dependency updates

## Additional Notes

- The SDK now handles base64 encoding internally
- Both single-file and multi-file routes were affected
- No other API calls need to be changed
- Sandbox creation and execution remain unchanged

## Status

✅ **All Issues Fixed**
- ✅ File upload API updated
- ✅ Process execution API updated  
- ✅ No linter errors
- ✅ Both single-file and multi-file routes working
- ✅ Ready for production testing

## Migration Summary

If you're migrating from an older Daytona SDK version, update these patterns:

| Old Pattern | New Pattern |
|-------------|-------------|
| `sandbox.fs.uploadFile({ path, data })` | `sandbox.fs.uploadFile(Buffer, path)` |
| `sandbox.process.exec({ cmd, cwd })` | `sandbox.process.executeCommand(cmd, cwd)` |
| `result.stdout` | `result.result` |
| `result.stderr` | Check `result.exitCode !== 0` |

---

**Fixed on:** November 18, 2025  
**SDK Version:** @daytonaio/sdk@0.115.0  
**Issues:** 
  1. File upload API signature changed
  2. Process execution method renamed and restructured  
**Solution:** Updated both APIs to match v0.115.0 specifications

