import { Router } from 'express';
import { PokemonExpansionService } from '../services/pokemonExpansion';
import { FunkoExpansionService } from '../services/funkoExpansion';
import { MangaExpansionService } from '../services/mangaExpansion';
import { MovieExpansionService } from '../services/movieExpansion';

const router = Router();

const pokemonService = new PokemonExpansionService();
const funkoService = new FunkoExpansionService();
const mangaService = new MangaExpansionService();
const movieService = new MovieExpansionService();

// Pokemon expansion
router.post('/pokemon/expand-all', async (req, res) => {
  try {
    const csvPath = req.body.csvPath || '/tmp/kaggle_pokemon/pokemon.csv';
    const result = await pokemonService.processAll(csvPath);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Funko Pops expansion
router.post('/funko/expand-all', async (req, res) => {
  try {
    const csvPath = req.body.csvPath || '/tmp/kaggle_funko/data.csv';
    const result = await funkoService.processAll(csvPath);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Manga bestselling expansion
router.post('/manga/bestselling', async (req, res) => {
  try {
    const csvPath = req.body.csvPath || '/tmp/kaggle_manga_bestselling/best-selling-manga.csv';
    const result = await mangaService.processBestselling(csvPath);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Manga comprehensive expansion
router.post('/manga/comprehensive', async (req, res) => {
  try {
    const csvPath = req.body.csvPath || '/tmp/kaggle_manga_comprehensive/data.csv';
    const result = await mangaService.processComprehensive(csvPath);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Marvel/DC movies expansion
router.post('/movies/expand-all', async (req, res) => {
  try {
    const csvPath = req.body.csvPath || '/tmp/kaggle_marvel_dc_movies/Marvel Vs DC.csv';
    const result = await movieService.processAll(csvPath);
    res.json(result);
  } catch (error) {
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
    
    const total = {
      inserted: Object.values(results).reduce((sum, r) => sum + r.inserted, 0),
      skipped: Object.values(results).reduce((sum, r) => sum + r.skipped, 0),
      errors: Object.values(results).reduce((sum, r) => sum + r.errors, 0)
    };
    
    res.json({ ...results, total });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router;
