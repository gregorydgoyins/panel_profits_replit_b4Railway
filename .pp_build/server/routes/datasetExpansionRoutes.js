"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pokemonExpansion_1 = require("../services/pokemonExpansion");
const funkoExpansion_1 = require("../services/funkoExpansion");
const mangaExpansion_1 = require("../services/mangaExpansion");
const movieExpansion_1 = require("../services/movieExpansion");
const leagueOfComicGeeksExpansion_1 = require("../services/leagueOfComicGeeksExpansion");
const kaggleRound2Expansion_1 = require("../services/kaggleRound2Expansion");
const router = (0, express_1.Router)();
const pokemonService = new pokemonExpansion_1.PokemonExpansionService();
const funkoService = new funkoExpansion_1.FunkoExpansionService();
const mangaService = new mangaExpansion_1.MangaExpansionService();
const movieService = new movieExpansion_1.MovieExpansionService();
const kaggleR2Service = new kaggleRound2Expansion_1.KaggleRound2ExpansionService();
const leagueService = process.env.LEAGUE_OF_COMIC_GEEKS_SESSION
    ? new leagueOfComicGeeksExpansion_1.LeagueOfComicGeeksExpansionService(process.env.LEAGUE_OF_COMIC_GEEKS_SESSION)
    : null;
// Pokemon expansion
router.post('/pokemon/expand-all', async (req, res) => {
    try {
        const csvPath = req.body.csvPath || '/tmp/kaggle_pokemon/pokemon.csv';
        const result = await pokemonService.processAll(csvPath);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Funko Pops expansion
router.post('/funko/expand-all', async (req, res) => {
    try {
        const csvPath = req.body.csvPath || '/tmp/kaggle_funko/data.csv';
        const result = await funkoService.processAll(csvPath);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Manga bestselling expansion
router.post('/manga/bestselling', async (req, res) => {
    try {
        const csvPath = req.body.csvPath || '/tmp/kaggle_manga_bestselling/best-selling-manga.csv';
        const result = await mangaService.processBestselling(csvPath);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Manga comprehensive expansion
router.post('/manga/comprehensive', async (req, res) => {
    try {
        const csvPath = req.body.csvPath || '/tmp/kaggle_manga_comprehensive/data.csv';
        const result = await mangaService.processComprehensive(csvPath);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Marvel/DC movies expansion
router.post('/movies/expand-all', async (req, res) => {
    try {
        const csvPath = req.body.csvPath || '/tmp/kaggle_marvel_dc_movies/Marvel Vs DC.csv';
        const result = await movieService.processAll(csvPath);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// League of Comic Geeks expansion
router.post('/league/expand-all', async (req, res) => {
    try {
        if (!leagueService) {
            return res.status(400).json({ error: 'LEAGUE_OF_COMIC_GEEKS_SESSION not configured' });
        }
        const result = await leagueService.expandAssets();
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Kaggle Round 2 expansion (indie comics, dbz, anime, genshin, honkai)
router.post('/kaggle-round-2/expand-all', async (req, res) => {
    try {
        const result = await kaggleR2Service.processAll();
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Process ALL datasets at once
router.post('/expand-all-datasets', async (req, res) => {
    try {
        const results = {
            pokemon: await pokemonService.processAll('/tmp/kaggle_pokemon/pokemon.csv'),
            funko: await funkoService.processAll('/tmp/kaggle_funko/data.csv'),
            mangaBestselling: await mangaService.processBestselling('/tmp/kaggle_manga_bestselling/best-selling-manga.csv'),
            mangaComprehensive: await mangaService.processComprehensive('/tmp/kaggle_manga_comprehensive/data.csv'),
            movies: await movieService.processAll('/tmp/kaggle_marvel_dc_movies/Marvel Vs DC.csv')
        };
        // Add League if configured
        if (leagueService) {
            results.league = await leagueService.expandAssets();
        }
        const total = {
            inserted: Object.values(results).reduce((sum, r) => sum + r.inserted, 0),
            skipped: Object.values(results).reduce((sum, r) => sum + r.skipped, 0),
            errors: Object.values(results).reduce((sum, r) => sum + r.errors, 0)
        };
        res.json({ ...results, total });
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});
exports.default = router;
