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
exports.isAuthenticated = void 0;
exports.getSession = getSession;
exports.setupAuth = setupAuth;
const client = __importStar(require("openid-client"));
const passport_1 = require("openid-client/passport");
const passport_2 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const memoizee_1 = __importDefault(require("memoizee"));
const connect_pg_simple_1 = __importDefault(require("connect-pg-simple"));
const storage_1 = require("./storage");
if (!process.env.REPLIT_DOMAINS) {
    throw new Error("Environment variable REPLIT_DOMAINS not provided");
}
const getOidcConfig = (0, memoizee_1.default)(async () => {
    return await client.discovery(new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"), process.env.REPL_ID);
}, { maxAge: 3600 * 1000 });
function getSession() {
    const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
    const pgStore = (0, connect_pg_simple_1.default)(express_session_1.default);
    const sessionStore = new pgStore({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: false,
        ttl: sessionTtl,
        tableName: "sessions",
    });
    return (0, express_session_1.default)({
        secret: process.env.SESSION_SECRET,
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: sessionTtl,
        },
    });
}
function updateUserSession(user, tokens) {
    user.claims = tokens.claims();
    user.access_token = tokens.access_token;
    user.refresh_token = tokens.refresh_token;
    user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
    // Generate username from claims - fallback chain: username > first_name+last_name > email > sub
    let username = claims["username"];
    if (!username && claims["first_name"] && claims["last_name"]) {
        username = `${claims["first_name"].toLowerCase()}${claims["last_name"].toLowerCase()}`;
    }
    if (!username && claims["email"]) {
        username = claims["email"].split("@")[0];
    }
    if (!username) {
        username = `user_${claims["sub"]}`;
    }
    await storage_1.storage.upsertUser({
        id: claims["sub"],
        email: claims["email"],
        firstName: claims["first_name"],
        lastName: claims["last_name"],
        profileImageUrl: claims["profile_image_url"],
        username: username, // Add username field
    });
}
async function setupAuth(app) {
    app.set("trust proxy", 1);
    app.use(getSession());
    app.use(passport_2.default.initialize());
    app.use(passport_2.default.session());
    const config = await getOidcConfig();
    const verify = async (tokens, verified) => {
        const user = {};
        updateUserSession(user, tokens);
        await upsertUser(tokens.claims());
        verified(null, user);
    };
    for (const domain of process.env
        .REPLIT_DOMAINS.split(",")) {
        const strategy = new passport_1.Strategy({
            name: `replitauth:${domain}`,
            config,
            scope: "openid email profile offline_access",
            callbackURL: `https://${domain}/api/callback`,
        }, verify);
        passport_2.default.use(strategy);
    }
    passport_2.default.serializeUser((user, cb) => cb(null, user));
    passport_2.default.deserializeUser((user, cb) => cb(null, user));
    app.get("/api/login", (req, res, next) => {
        passport_2.default.authenticate(`replitauth:${req.hostname}`, {
            prompt: "login consent",
            scope: ["openid", "email", "profile", "offline_access"],
        })(req, res, next);
    });
    app.get("/api/callback", (req, res, next) => {
        passport_2.default.authenticate(`replitauth:${req.hostname}`, {
            successReturnToOrRedirect: "/",
            failureRedirect: "/api/login",
        })(req, res, next);
    });
    app.get("/api/logout", (req, res) => {
        req.logout(() => {
            res.redirect(client.buildEndSessionUrl(config, {
                client_id: process.env.REPL_ID,
                post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
            }).href);
        });
    });
    // POST logout route for frontend logout button
    app.post("/api/auth/logout", (req, res) => {
        req.logout((err) => {
            if (err) {
                return res.status(500).json({ error: "Logout failed" });
            }
            // Destroy the session
            req.session.destroy((err) => {
                if (err) {
                    return res.status(500).json({ error: "Session destruction failed" });
                }
                res.clearCookie('connect.sid'); // Clear the session cookie
                res.json({ success: true, message: "Logged out successfully" });
            });
        });
    });
    // Smart "Closers Only" login - checks for existing session first
    app.get("/api/auth/closers", (req, res) => {
        // Check if user already has an active session
        if (req.isAuthenticated()) {
            // Session exists - skip OAuth, go straight to dashboard
            return res.redirect("/dashboard");
        }
        // No session - save intended destination and trigger OAuth flow
        req.session.returnTo = "/dashboard";
        return res.redirect("/api/login");
    });
    // "Help Wanted" new player flow - triggers auth then entry test
    app.get("/api/auth/new-player", (req, res) => {
        // Check if user already has an active session
        if (req.isAuthenticated()) {
            // Session exists - go to entry test
            return res.redirect("/entry-test");
        }
        // No session - save intended destination and trigger OAuth flow
        req.session.returnTo = "/entry-test";
        return res.redirect("/api/login");
    });
}
const isAuthenticated = async (req, res, next) => {
    const user = req.user;
    if (!req.isAuthenticated() || !user.expires_at) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const now = Math.floor(Date.now() / 1000);
    if (now <= user.expires_at) {
        return next();
    }
    const refreshToken = user.refresh_token;
    if (!refreshToken) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const config = await getOidcConfig();
        const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
        updateUserSession(user, tokenResponse);
        return next();
    }
    catch (error) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
};
exports.isAuthenticated = isAuthenticated;
