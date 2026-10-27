import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'

function onDemandExtractorPlugin(): Plugin {
  return {
    name: 'on-demand-extractor-api',
    configureServer(server) {
      // 1. Directly serve voter roll JSON files from disk (bypassing Vite SPA index.html fallback)
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/data/voters/')) {
          const cleanUrl = req.url.split('?')[0];
          const filePath = path.resolve(import.meta.dirname, 'public' + cleanUrl);
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            res.writeHead(200, {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
            });
            return res.end(fs.readFileSync(filePath));
          }
        }
        next();
      });

      // 2. Handle on-demand extraction API
      server.middlewares.use('/api/extract-booth', async (req, res) => {
        if (req.method === 'OPTIONS') {
          res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          });
          return res.end();
        }

        const url = new URL(req.url || '', `http://${req.headers.host}`);

        // Handle GET status check
        if (req.method === 'GET') {
          const ac = url.searchParams.get('ac');
          const booth = url.searchParams.get('booth');
          if (!ac || !booth) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Missing ac or booth query parameter' }));
          }

          const targetFile = path.resolve(import.meta.dirname, `public/data/voters/ac_${ac}/booth_${booth}.json`);
          const exists = fs.existsSync(targetFile);
          let summary = null;
          if (exists) {
            try {
              const content = JSON.parse(fs.readFileSync(targetFile, 'utf-8'));
              summary = {
                acNo: content.acNo,
                boothNo: content.boothNo,
                totalElectors: content.totalElectors,
                totalPages: content.totalPages,
                rollSource: content.roll_source,
                isAuthenticExtract: true
              };
            } catch (e) {
              // file being written or corrupt
            }
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ exists, summary }));
        }

        // Handle POST trigger extraction
        if (req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk) => { bodyStr += chunk; });
          req.on('end', () => {
            let body: any = {};
            try {
              body = JSON.parse(bodyStr);
            } catch (err) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ error: 'Invalid JSON request body' }));
            }

            const { ac, booth, state = 'S01', force = false } = body;
            if (!ac || !booth) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ error: 'Missing ac or booth parameter' }));
            }

            const targetFile = path.resolve(import.meta.dirname, `public/data/voters/ac_${ac}/booth_${booth}.json`);
            if (!force && fs.existsSync(targetFile)) {
              try {
                const existing = JSON.parse(fs.readFileSync(targetFile, 'utf-8'));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                  success: true,
                  alreadyExtracted: true,
                  data: {
                    acNo: existing.acNo,
                    boothNo: existing.boothNo,
                    totalElectors: existing.totalElectors,
                    totalPages: existing.totalPages,
                    roll_source: existing.roll_source,
                    isAuthenticExtract: true
                  }
                }));
              } catch (e) {
                // re-run if corrupt
              }
            }

            const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
            const scriptPath = path.resolve(import.meta.dirname, '../scripts/extract_booth_voters.py');

            const args = [
              scriptPath,
              '--ac', String(ac),
              '--booth', String(booth),
              '--state', String(state)
            ];

            let stdoutData = '';
            let stderrData = '';

            const child = spawn(pythonCmd, args, {
              cwd: path.resolve(import.meta.dirname, '..'),
              env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
            });

            child.stdout.on('data', (data) => {
              stdoutData += data.toString('utf-8');
            });

            child.stderr.on('data', (data) => {
              stderrData += data.toString('utf-8');
            });

            child.on('close', (code) => {
              if (code !== 0) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                  success: false,
                  error: `Extractor process exited with code ${code}`,
                  stderr: stderrData,
                  stdout: stdoutData
                }));
              }

              // Extract json result marker
              const match = stdoutData.match(/__EXTRACT_RESULT__\s+([^\r\n]+)/);
              let parsedResult = null;
              if (match) {
                try {
                  parsedResult = JSON.parse(match[1]);
                } catch {
                  // ignore
                }
              }

              res.writeHead(200, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({
                success: true,
                result: parsedResult,
                stdout: stdoutData
              }));
            });
          });
          return;
        }

        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method not allowed' }));
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    onDemandExtractorPlugin()
  ],
  server: {
    watch: {
      ignored: [
        '**/public/data/voters/**',
        '**/dist/**',
        '**/.git/**',
        '**/data_archive/**',
      ],
    },
  },
})
