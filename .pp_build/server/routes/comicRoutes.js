"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerComicRoutes = registerComicRoutes;
const storage_1 = require("../storage");
const comicDataImportService_1 = require("../services/comicDataImportService");
const schema_1 = require("@shared/schema");
const zod_1 = require("zod");
function registerComicRoutes(app) {
    // Comic Series Routes
    app.get("/api/comics/series", async (req, res) => {
        try {
            const { publisher, year, search, limit } = req.query;
            const filters = {
                publisher: publisher,
                year: year ? parseInt(year) : undefined,
                search: search,
                limit: limit ? parseInt(limit) : undefined
            };
            const series = await storage_1.storage.getComicSeriesList(filters);
            res.json(series);
        }
        catch (error) {
            console.error("Error fetching comic series:", error);
            res.status(500).json({ error: "Failed to fetch comic series" });
        }
    });
    app.get("/api/comics/series/:id", async (req, res) => {
        try {
            const series = await storage_1.storage.getComicSeries(req.params.id);
            if (!series) {
                return res.status(404).json({ error: "Comic series not found" });
            }
            res.json(series);
        }
        catch (error) {
            console.error("Error fetching comic series:", error);
            res.status(500).json({ error: "Failed to fetch comic series" });
        }
    });
    app.post("/api/comics/series", async (req, res) => {
        try {
            const validatedData = schema_1.insertComicSeriesSchema.parse(req.body);
            const series = await storage_1.storage.createComicSeries(validatedData);
            res.status(201).json(series);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: "Invalid series data", details: error.errors });
            }
            console.error("Error creating comic series:", error);
            res.status(500).json({ error: "Failed to create comic series" });
        }
    });
    // Comic Issues Routes
    app.get("/api/comics/issues", async (req, res) => {
        try {
            const { seriesId, search, writer, artist, limit } = req.query;
            const filters = {
                seriesId: seriesId,
                search: search,
                writer: writer,
                artist: artist,
                limit: limit ? parseInt(limit) : undefined
            };
            const issues = await storage_1.storage.getComicIssues(filters);
            res.json(issues);
        }
        catch (error) {
            console.error("Error fetching comic issues:", error);
            res.status(500).json({ error: "Failed to fetch comic issues" });
        }
    });
    app.get("/api/comics/issues/:id", async (req, res) => {
        try {
            const issue = await storage_1.storage.getComicIssue(req.params.id);
            if (!issue) {
                return res.status(404).json({ error: "Comic issue not found" });
            }
            res.json(issue);
        }
        catch (error) {
            console.error("Error fetching comic issue:", error);
            res.status(500).json({ error: "Failed to fetch comic issue" });
        }
    });
    app.get("/api/comics/series/:seriesId/issues", async (req, res) => {
        try {
            const issues = await storage_1.storage.getComicIssuesBySeriesId(req.params.seriesId);
            res.json(issues);
        }
        catch (error) {
            console.error("Error fetching series issues:", error);
            res.status(500).json({ error: "Failed to fetch series issues" });
        }
    });
    app.post("/api/comics/issues", async (req, res) => {
        try {
            const validatedData = schema_1.insertComicIssueSchema.parse(req.body);
            const issue = await storage_1.storage.createComicIssue(validatedData);
            res.status(201).json(issue);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: "Invalid issue data", details: error.errors });
            }
            console.error("Error creating comic issue:", error);
            res.status(500).json({ error: "Failed to create comic issue" });
        }
    });
    // Comic Creators Routes
    app.get("/api/comics/creators", async (req, res) => {
        try {
            const { role, search, limit } = req.query;
            const filters = {
                role: role,
                search: search,
                limit: limit ? parseInt(limit) : undefined
            };
            const creators = await storage_1.storage.getComicCreators(filters);
            res.json(creators);
        }
        catch (error) {
            console.error("Error fetching comic creators:", error);
            res.status(500).json({ error: "Failed to fetch comic creators" });
        }
    });
    app.get("/api/comics/creators/:id", async (req, res) => {
        try {
            const creator = await storage_1.storage.getComicCreator(req.params.id);
            if (!creator) {
                return res.status(404).json({ error: "Comic creator not found" });
            }
            res.json(creator);
        }
        catch (error) {
            console.error("Error fetching comic creator:", error);
            res.status(500).json({ error: "Failed to fetch comic creator" });
        }
    });
    // Featured Comics Routes
    app.get("/api/comics/featured", async (req, res) => {
        try {
            const { featureType, isActive, limit } = req.query;
            const filters = {
                featureType: featureType,
                isActive: isActive === 'true',
                limit: limit ? parseInt(limit) : undefined
            };
            const featured = await storage_1.storage.getFeaturedComics(filters);
            res.json(featured);
        }
        catch (error) {
            console.error("Error fetching featured comics:", error);
            res.status(500).json({ error: "Failed to fetch featured comics" });
        }
    });
    app.get("/api/comics/featured/homepage", async (req, res) => {
        try {
            const featured = await storage_1.storage.getFeaturedComicsForHomepage();
            res.json(featured);
        }
        catch (error) {
            console.error("Error fetching homepage featured comics:", error);
            res.status(500).json({ error: "Failed to fetch homepage featured comics" });
        }
    });
    app.post("/api/comics/featured", async (req, res) => {
        try {
            const validatedData = schema_1.insertFeaturedComicSchema.parse(req.body);
            const featured = await storage_1.storage.createFeaturedComic(validatedData);
            res.status(201).json(featured);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: "Invalid featured comic data", details: error.errors });
            }
            console.error("Error creating featured comic:", error);
            res.status(500).json({ error: "Failed to create featured comic" });
        }
    });
    // Comic Metrics and Analytics
    app.get("/api/comics/metrics", async (req, res) => {
        try {
            const metrics = await storage_1.storage.getComicMetrics();
            res.json(metrics);
        }
        catch (error) {
            console.error("Error fetching comic metrics:", error);
            res.status(500).json({ error: "Failed to fetch comic metrics" });
        }
    });
    app.get("/api/comics/trending", async (req, res) => {
        try {
            const { limit } = req.query;
            const trending = await storage_1.storage.getTrendingComicSeries(limit ? parseInt(limit) : undefined);
            res.json(trending);
        }
        catch (error) {
            console.error("Error fetching trending comics:", error);
            res.status(500).json({ error: "Failed to fetch trending comics" });
        }
    });
    // Data Import Routes (for admin use)
    app.post("/api/comics/import/series", async (req, res) => {
        try {
            const result = await comicDataImportService_1.ComicDataImportService.importComicSeriesFromCSV('attached_assets/comic_list_1758981354593.csv');
            res.json({
                success: true,
                imported: result.imported,
                errors: result.errors
            });
        }
        catch (error) {
            console.error("Error importing comic series:", error);
            res.status(500).json({ error: "Failed to import comic series" });
        }
    });
    app.post("/api/comics/import/issues", async (req, res) => {
        try {
            const result = await comicDataImportService_1.ComicDataImportService.importComicIssuesFromCSV('attached_assets/Marvel_Comics 2_1758981404739.csv');
            res.json({
                success: true,
                imported: result.imported,
                errors: result.errors
            });
        }
        catch (error) {
            console.error("Error importing comic issues:", error);
            res.status(500).json({ error: "Failed to import comic issues" });
        }
    });
    app.post("/api/comics/import/all", async (req, res) => {
        try {
            const results = await comicDataImportService_1.ComicDataImportService.importAllComicData();
            res.json({
                success: true,
                series: results.seriesResults,
                issues: results.issuesResults
            });
        }
        catch (error) {
            console.error("Error importing all comic data:", error);
            res.status(500).json({ error: "Failed to import comic data" });
        }
    });
    app.get("/api/comics/import/stats", async (req, res) => {
        try {
            const stats = await comicDataImportService_1.ComicDataImportService.getImportStatistics();
            res.json(stats);
        }
        catch (error) {
            console.error("Error fetching import statistics:", error);
            res.status(500).json({ error: "Failed to fetch import statistics" });
        }
    });
}
