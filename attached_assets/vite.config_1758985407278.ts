import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { Connect } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    // Enable Web Workers
    {
      name: 'web-workers',
      config(config) {
        config.worker = {
          format: 'es'
        };
      }
    },
    {
      name: 'health-check-upgraded',
      configureServer(server) {
        server.middlewares.use((req: Connect.IncomingMessage, res: Connect.ServerResponse, next: Connect.NextFunction) => {
          console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
          next();
        });

        server.middlewares.use('/health', (_req: Connect.IncomingMessage, res: Connect.ServerResponse) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            version: process.env.npm_package_version || '1.0.0',
            environment: process.env.NODE_ENV || 'development'
          }));
        });

        server.middlewares.use('/api/status', (_req: Connect.IncomingMessage, res: Connect.ServerResponse) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            server: 'running',
            hash: 'enabled',
            routes: 'active',
            assets: 'loaded'
          }));
        });

        server.middlewares.use((err: Error, _req: Connect.IncomingMessage, res: Connect.ServerResponse, next: Connect.NextFunction) => {
          if (err) {
            console.error('Server error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({
              error: 'Internal Server Error',
              message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred',
              timestamp: new Date().toISOString()
            }));
            return;
          }
          next();
        });
      }
    }
  ],
  optimizeDeps: {
    include: [
      'highcharts',
      'highcharts/modules/stock',
      'highcharts/modules/indicators',
      'highcharts/modules/sma',
      'highcharts/modules/bollinger-bands',
      'highcharts/modules/ema',
      'highcharts/modules/macd',
      'highcharts/modules/rsi',
      'highcharts/modules/stochastic',
      'highcharts/modules/williams-r',
      'highcharts/modules/cci',
      'highcharts/modules/obv',
      'highcharts/modules/atr',
      'highcharts/modules/psar'
    ]
  },
  server: {
    port: Number(process.env.VITE_PORT) || 4173,
    open: true,
    strictPort: false,
    cors: true,
    host: true,
    // Optimize for development with large simulations
    hmr: {
      overlay: false // Disable overlay during heavy computation
    }
  },
  preview: {
    port: 4173,
    open: true,
    strictPort: false,
    cors: true,
    host: true
  },
  // Optimize build for Web Workers
  build: {
    commonjsOptions: {
      include: [
        'highcharts',
        'highcharts/modules/indicators',
        'highcharts/modules/sma',
        'highcharts/modules/bollinger-bands',
        'highcharts/modules/ema',
        'highcharts/modules/macd',
        'highcharts/modules/rsi',
        'highcharts/modules/stochastic',
        'highcharts/modules/williams-r',
        'highcharts/modules/cci',
        'highcharts/modules/obv',
        'highcharts/modules/atr',
        'highcharts/modules/psar'
      ]
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'simulation-worker': ['./src/services/simulationWorker.ts']
        }
      }
    }
  }
})

// Add this to your Tailwind config to enable marquee animation
// tailwind.config.ts or tailwind.config.js
// theme.extend.keyframes.ticker and theme.extend.animation.ticker
// Then use class="animate-ticker" in your HTML
