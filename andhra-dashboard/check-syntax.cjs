const ts = require('typescript');
const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, 'tsconfig.app.json');
const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, __dirname);

const program = ts.createProgram([path.resolve(__dirname, 'src/components/BoothDataView.tsx')], parsedConfig.options);
const diagnostics = ts.getPreEmitDiagnostics(program);

const targetFileDiagnostics = diagnostics.filter(d => d.file && d.file.fileName.includes('BoothDataView.tsx'));

console.log('Diagnostics in BoothDataView.tsx count:', targetFileDiagnostics.length);
targetFileDiagnostics.forEach(d => {
  const { line, character } = d.file.getLineAndCharacterOfPosition(d.start);
  const msg = ts.flattenDiagnosticMessageText(d.messageText, '\n');
  console.log(`BoothDataView.tsx (${line + 1},${character + 1}): ${msg}`);
});

