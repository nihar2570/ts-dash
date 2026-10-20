const ts = require('typescript');
const fs = require('fs');

const code = fs.readFileSync('src/components/BoothDataView.tsx', 'utf8');
const result = ts.transpileModule(code, {
  compilerOptions: {
    jsx: ts.JsxEmit.ReactJSX,
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
  },
  reportDiagnostics: true,
  fileName: 'BoothDataView.tsx',
});

if (result.diagnostics && result.diagnostics.length > 0) {
  console.log('Syntactic Diagnostics count:', result.diagnostics.length);
  for (const d of result.diagnostics) {
    const { line, character } = d.file.getLineAndCharacterOfPosition(d.start);
    console.log(`Line ${line + 1}:${character + 1} - ${d.messageText}`);
  }
} else {
  console.log('No syntactic diagnostics in BoothDataView.tsx');
}

