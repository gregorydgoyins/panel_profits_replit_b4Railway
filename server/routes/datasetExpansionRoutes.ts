import { Router } from 'express';
import { PokemonExpansionService } from '../services/pokemonExpansion';
import { FunkoExpansionService } from '../services/funkoExpansion';
import { MangaExpansionService } from '../services/mangaExpansion';
import { MovieExpansionService } from '../services/movieExpansion';
import { LeagueOfComicGeeksExpansionService } from '../services/leagueOfComicGeeksExpansion';

const router = Router();

const pokemonService = new PokemonExpansionService();
const funkoService = new FunkoExpansionService();
const mangaService = new MangaExpansionService();
const movieService = new MovieExpansionService();
const leagueService = process.env.LEAGUE_OF_COMIC_GEEKS_SESSION 
  ? new LeagueOfComicGeeksExpansionService(process.env.LEAGUE_OF_COMIC_GEEKS_SESSION)
  : null;

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

// League of Comic Geeks expansion
router.post('/league/expand-all', async (req, res) => {
  try {
    if (!leagueService) {
      return res.status(400).json({ error: 'LEAGUE_OF_COMIC_GEEKS_SESSION not configured' });
    }
    const result = await leagueService.expandAssets();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Process ALL datasets at once
router.post('/expand-all-datasets', async (req, res) => {
  try {
    const results: any = {
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
      inserted: Object.values(results).reduce((sum: number, r: any) => sum + r.inserted, 0),
      skipped: Object.values(results).reduce((sum: number, r: any) => sum + r.skipped, 0),
      errors: Object.values(results).reduce((sum: number, r: any) => sum + r.errors, 0)
    };
    
    res.json({ ...results, total });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router;
