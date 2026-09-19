import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import {
  handleAnalyzeExplanation,
  handleEvaluateChallenge,
  loadHistoryFromDisk,
  saveSessionToDisk,
  clearHistoryOnDisk,
} from './src/server/apiHandler.ts';

function explainItBackApiPlugin(): Plugin {
  const createApiMiddleware = () => {
    return async (req: any, res: any, next: any) => {
      const url = req.url?.split('?')[0];

      if (!url?.startsWith('/api/')) {
        return next();
      }

      const parseBody = (): Promise<any> => {
        return new Promise((resolve) => {
          let data = '';
          req.on('data', (chunk: any) => {
            data += chunk;
          });
          req.on('end', () => {
            try {
              resolve(data ? JSON.parse(data) : {});
            } catch {
              resolve({});
            }
          });
        });
      };

      const sendJson = (data: any, status = 200) => {
        res.statusCode = status;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      };

      try {
        if (url === '/api/analyze' && req.method === 'POST') {
          const body = await parseBody();
          const { topic, explanation } = body;
          if (!topic || !explanation) {
            return sendJson({ error: 'Missing topic or explanation' }, 400);
          }
          const analysis = await handleAnalyzeExplanation(topic, explanation);
          return sendJson(analysis);
        }

        if (url === '/api/challenge' && req.method === 'POST') {
          const body = await parseBody();
          const result = await handleEvaluateChallenge(body);
          return sendJson(result);
        }

        if (url === '/api/history' && req.method === 'GET') {
          const history = loadHistoryFromDisk();
          return sendJson(history);
        }

        if (url === '/api/history' && req.method === 'POST') {
          const body = await parseBody();
          if (body.session) {
            saveSessionToDisk(body.session);
          }
          return sendJson({ success: true });
        }

        if (url === '/api/history' && req.method === 'DELETE') {
          clearHistoryOnDisk();
          return sendJson({ success: true });
        }

        return next();
      } catch (err: any) {
        console.warn('[API Middleware Note]:', err?.message || err);
        return sendJson({ error: err?.message || 'Internal Server Error' }, 500);
      }
    };
  };

  return {
    name: 'explainitback-api-plugin',
    configureServer(server) {
      server.middlewares.use(createApiMiddleware());
    },
    configurePreviewServer(server) {
      server.middlewares.use(createApiMiddleware());
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), explainItBackApiPlugin()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
});
