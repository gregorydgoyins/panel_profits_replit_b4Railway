"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const vite_1 = require("./vite");
const phase1ScheduledServices_js_1 = require("./phase1ScheduledServices.js");
const phase2ScheduledServices_js_1 = require("./phase2ScheduledServices.js");
const pineconeService_1 = require("./services/pineconeService");
const openaiService_1 = require("./services/openaiService");
const workerOrchestrator_1 = require("./queue/workerOrchestrator");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse = undefined;
    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
        capturedJsonResponse = bodyJson;
        return originalResJson.apply(res, [bodyJson, ...args]);
    };
    res.on("finish", () => {
        const duration = Date.now() - start;
        if (path.startsWith("/api")) {
            let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
            if (capturedJsonResponse) {
                logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
            }
            if (logLine.length > 80) {
                logLine = logLine.slice(0, 79) + "…";
            }
            (0, vite_1.log)(logLine);
        }
    });
    next();
});
(async () => {
    // Initialize critical WebSocket protocol override BEFORE any WebSocket servers start
    // TEMPORARILY DISABLED: WebSocket overrides are causing Vite HMR frame errors
    // console.log('🔒 Pre-initializing WebSocket protocol override for Vite HMR...');
    // initializeWebSocketProtocolOverride();
    // applyEmergencyProtocolOverride();
    const server = await (0, routes_1.registerRoutes)(app);
    app.use((err, _req, res, _next) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        res.status(status).json({ message });
        throw err;
    });
    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    // EMERGENCY FIX: Use Vite development mode to bypass corrupted production bundle
    // The production build is corrupted, so we'll use Vite dev mode instead
    if (process.env.NODE_ENV === "development") {
        const { setupVite } = await Promise.resolve().then(() => __importStar(require("./vite.js")));
        await setupVite(app, server);
    }
    else {
        (0, vite_1.serveStatic)(app);
    }
    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || '5000', 10);
    server.listen({
        port,
        host: "0.0.0.0",
        reusePort: true,
    }, async () => {
        (0, vite_1.log)(`serving on port ${port}`);
        console.log('=== SERVER STARTUP SEQUENCE BEGINNING ===');
        // PINECONE INTEGRATION: Connect to vector database
        console.log('🔗 About to initialize Pinecone...');
        try {
            const result = await pineconeService_1.pineconeService.init();
            console.log('✅ Pinecone initialization complete, result:', result ? 'success' : 'skipped/failed');
        }
        catch (error) {
            console.error('❌ Failed to initialize Pinecone:', error);
            console.error('Error stack:', error instanceof Error ? error.stack : 'no stack');
        }
        // OPENAI INTEGRATION: Initialize embedding service
        try {
            await openaiService_1.openaiService.init();
            console.log('✅ OpenAI service initialized');
        }
        catch (error) {
            console.error('❌ Failed to initialize OpenAI:', error);
        }
        // PHASE 1 INTEGRATION: Start all scheduled services for living financial simulation
        try {
            await phase1ScheduledServices_js_1.phase1Services.start();
            (0, vite_1.log)('🚀 Phase 1 Core Trading Foundation: All engines are now LIVE and operational!');
        }
        catch (error) {
            console.error('Failed to start Phase 1 scheduled services:', error);
        }
        // PHASE 2 INTEGRATION: Start narrative-driven trading features
        try {
            await phase2ScheduledServices_js_1.phase2Services.start();
            (0, vite_1.log)('📖 Phase 2 Narrative Trading: Storytelling engines are now LIVE!');
        }
        catch (error) {
            console.error('Failed to start Phase 2 scheduled services:', error);
        }
        // QUEUE SYSTEM: Start BullMQ workers for async processing
        // Queue workers re-enabled - Upstash upgraded!
        try {
            await workerOrchestrator_1.workerOrchestrator.start();
            (0, vite_1.log)('⚙️  Queue System: Workers ready for async verification pipeline!');
        }
        catch (error) {
            console.error('❌ Failed to start queue workers:', error);
            console.error('Error stack:', error instanceof Error ? error.stack : 'no stack');
        }
    });
})();
