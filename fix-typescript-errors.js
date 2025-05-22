const fs = require('fs');
const ts = require('typescript');
const path = require('path');
const glob = require('glob');

// Configuration
const rootDir = './app';
const dryRun = process.argv.includes('--dry-run');

// Find all TypeScript files
const files = glob.sync(`${rootDir}/**/*.ts`);
console.log(`Found ${files.length} TypeScript files to process`);

// Track statistics
const stats = {
  filesProcessed: 0,
  filesModified: 0,
  nullChecksAdded: 0,
  optionalChainingFixed: 0,
  errorHandlingFixed: 0
};

files.forEach(filePath => {
  try {
    const source = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Create a TypeScript SourceFile object
    const sourceFile = ts.createSourceFile(
      filePath,
      source,
      ts.ScriptTarget.Latest,
      true
    );
    
    // Output buffer for the transformed code
    let output = source;
    
    // 1. Check for supabaseAdmin imports and usage without null checks
    if (source.includes('supabaseAdmin') && !source.includes('if (!supabaseAdmin)')) {
      // Find try blocks that use supabaseAdmin
      const tryBlockRegex = /try\s*{([^}]*)supabaseAdmin([^}]*)}/gs;
      output = output.replace(tryBlockRegex, (match, before, after) => {
        if (!match.includes('if (!supabaseAdmin)')) {
          stats.nullChecksAdded++;
          modified = true;
          return `try {\n    // Add null check for supabaseAdmin\n    if (!supabaseAdmin) {\n      return NextResponse.json(\n        { error: 'Supabase admin client not initialized. Check environment variables.' },\n        { status: 500 }\n      );\n    }${before}supabaseAdmin${after}}`;
        }
        return match;
      });
    }
    
    // 2. Replace optional chaining with proper null checks
    if (source.includes('supabaseAdmin?.')) {
      const optionalChainingRegex = /supabaseAdmin\?\./g;
      if (optionalChainingRegex.test(output)) {
        output = output.replace(optionalChainingRegex, 'supabaseAdmin.');
        stats.optionalChainingFixed++;
        modified = true;
      }
    }
    
    // 3. Add type checking for error.message in catch blocks
    const catchBlockRegex = /catch\s*\(\s*error\s*\)\s*{([^}]*)error\.message([^}]*)}/gs;
    if (catchBlockRegex.test(output)) {
      output = output.replace(catchBlockRegex, (match, before, after) => {
        if (!match.includes('error instanceof Error')) {
          stats.errorHandlingFixed++;
          modified = true;
          return match.replace(/error\.message/g, 'error instanceof Error ? error.message : String(error)');
        }
        return match;
      });
    }
    
    // Write changes if modified and not in dry run mode
    if (modified) {
      stats.filesModified++;
      console.log(`Modifying: ${filePath}`);
      
      if (!dryRun) {
        fs.writeFileSync(filePath, output, 'utf8');
      }
    }
    
    stats.filesProcessed++;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
});

// Report results
console.log('\nResults:');
console.log(`Files processed: ${stats.filesProcessed}`);
console.log(`Files modified: ${stats.filesModified}`);
console.log(`Null checks added: ${stats.nullChecksAdded}`);
console.log(`Optional chaining fixed: ${stats.optionalChainingFixed}`);
console.log(`Error handling fixed: ${stats.errorHandlingFixed}`);

if (dryRun) {
  console.log('\nThis was a dry run. No files were modified. Run without --dry-run to apply changes.');
}