const fs = require('fs');
const path = require('path');
const tesseractPath = path.resolve(__dirname, '../telangana-dashboard/node_modules/tesseract.js');
const { createWorker } = require(tesseractPath);

async function processImages(page1Path, pageLastPath) {
  const worker = await createWorker('eng');
  
  let p1Text = '';
  let pLastText = '';

  if (page1Path && fs.existsSync(page1Path)) {
    const ret1 = await worker.recognize(page1Path);
    p1Text = ret1.data.text;
  }

  if (pageLastPath && fs.existsSync(pageLastPath)) {
    const retLast = await worker.recognize(pageLastPath);
    pLastText = retLast.data.text;
  }

  await worker.terminate();

  // Extract metadata from page 1
  // Polling station name
  let psName = '';
  // Look for lines like "1- MUCHINDRA" or "1 - MUCHINDRA" under Polling Station Details
  const psDetailBlock = p1Text.split(/3\.\s*Polling\s*Station\s*Details/i)[1] || p1Text;
  const nameLineMatch = psDetailBlock.match(/(?:(?:General\s*\n+|Male\/Female\/General\s*\n+))([0-9]+\s*[\-–]\s*[^\n]+)/i) ||
                        psDetailBlock.match(/([0-9]+\s*[\-–]\s*[A-Za-z\s]{3,40})/);
  if (nameLineMatch) {
    psName = nameLineMatch[1].split('\n')[0].replace(/Type\s*of.*/i, '').trim();
  }

  // Address
  let address = '';
  const addrMatch = psDetailBlock.match(/Address\s*of\s*Polling\s*Station\s*:[^\n]*\n*([^\n]+)/i);
  if (addrMatch) {
    let rawAddr = addrMatch[1].replace(/Number\s*of\s*Auxiliary.*/i, '').trim();
    if (!rawAddr || rawAddr.length < 3) {
      // Check next line
      const lines = psDetailBlock.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (/Address\s*of\s*Polling/i.test(lines[i]) && i + 1 < lines.length) {
          rawAddr = lines[i + 1].replace(/Number\s*of\s*Auxiliary.*/i, '').trim();
          if (rawAddr.length < 3 && i + 2 < lines.length) {
            rawAddr = lines[i + 2].trim();
          }
          break;
        }
      }
    }
    address = rawAddr;
  }

  // Mandal / Tehsil
  let mandal = '';
  const mandalMatch = p1Text.match(/Tehsil\s*[:\-\s]*([^\n]+)/i);
  if (mandalMatch) mandal = mandalMatch[1].trim();

  // Town / Village
  let village = '';
  const villMatch = p1Text.match(/Main\s*Town\s*or\s*Village\s*[:\-\s]*([^\n]+)/i);
  if (villMatch) village = villMatch[1].trim();

  // District
  let district = '';
  const distMatch = p1Text.match(/District\s*[:\-\s]*([^\n]+)/i);
  if (distMatch) district = distMatch[1].trim();

  // Elector counts from last page
  // Looking for "Male Female Third Total" followed by numbers
  let male = 0, female = 0, third = 0, total = 0;
  const numMatch = pLastText.match(/(\d{2,4})\s+(\d{2,4})\s+(\d{2,4})/);
  if (numMatch) {
    male = parseInt(numMatch[1], 10);
    female = parseInt(numMatch[2], 10);
    total = parseInt(numMatch[3], 10);
  }

  return {
    psName,
    address,
    mandal,
    village,
    district,
    male,
    female,
    third,
    total
  };
}

const [,, p1, pLast] = process.argv;
processImages(p1, pLast).then((res) => {
  console.log(JSON.stringify(res));
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
