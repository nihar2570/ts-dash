const fs = require('fs');
const dts = fs.readFileSync('node_modules/lucide-react/dist/lucide-react.d.ts', 'utf8');
console.log('FileSpreadsheet in lucide:', dts.includes('FileSpreadsheet'));
console.log('Sheet in lucide:', dts.includes('Sheet'));
console.log('Table in lucide:', dts.includes('Table'));
console.log('ListOrdered in lucide:', dts.includes('ListOrdered'));

