import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read src/utils/api.js
const apiPath = path.resolve(__dirname, '../src/utils/api.js');
const apiContent = fs.readFileSync(apiPath, 'utf8');

// Mock import.meta.env
// We will replace `import.meta.env` in the string content
const mockEnvCode = "const mockEnv = { VITE_BACKEND_URL: 'http://localhost:3000' };";

// Extract function body manually
// Remove `export const getBackendUrl = `
let functionDef = apiContent.replace('export const getBackendUrl = ', '');
// Remove trailing `;` if present
functionDef = functionDef.trim();
if (functionDef.endsWith(';')) {
  functionDef = functionDef.slice(0, -1);
}

// Replace import.meta.env with mockEnv
functionDef = functionDef.replace(/import\.meta\.env/g, 'mockEnv');

// Eval inside a wrapper that provides mockEnv
const implementation = `
  ${mockEnvCode}
  return (${functionDef});
`;

// Function to create the function from string
const createFunction = new Function(implementation);
const getBackendUrl = createFunction();


// Test function
const test = (name, actual, expected) => {
  if (actual === expected) {
    console.log(`✅ ${name}: Passed`);
  } else {
    console.error(`❌ ${name}: Failed`);
    console.error(`  Expected: ${expected}`);
    console.error(`  Actual:   ${actual}`);
    process.exit(1);
  }
};

// Test cases
console.log('Running getBackendUrl security verification...');

try {
  test(
    'Basic usage',
    getBackendUrl('/foo', { bar: 'baz' }),
    'http://localhost:3000/foo?bar=baz'
  );

  test(
    'Parameter encoding (Security Check)',
    getBackendUrl('/foo', { userid: 'a&b=c' }),
    'http://localhost:3000/foo?userid=a%26b%3Dc'
  );

  test(
    'Existing query params (Bug Fix Check)',
    getBackendUrl('/foo?a=b', { c: 'd' }),
    'http://localhost:3000/foo?a=b&c=d'
  );

  test(
    'Missing values',
    getBackendUrl('/foo', { a: null, b: undefined, c: 'd' }),
    'http://localhost:3000/foo?c=d'
  );

  console.log('All tests passed. getBackendUrl is secure and correct.');
} catch (error) {
  console.error('Test execution failed:', error);
  process.exit(1);
}
