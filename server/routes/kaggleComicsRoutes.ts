import { Router } from 'express';
import { KaggleComicsExpansionService } from '../services/kaggleComicsExpansion';

const router = Router();
const service = new KaggleComicsExpansionService();

router.post('/marvel/expand', async (req, res) => {
  try {
    const csvPath = req.body.csvPath || '/tmp/kaggle_marvel_comics/Marvel_Comics.csv';
    const result = await service.processMarvelComics(csvPath);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.post('/dc/expand', async (req, res) => {
  try {
    const csvPath = req.body.csvPath || '/tmp/kaggle_dc_comics/Complete_DC_Comic_Books.csv';
    const result = await service.processDCComics(csvPath);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.post('/expand-all', async (req, res) => {
  try {
    const marvelPath = '/tmp/kaggle_marvel_comics/Marvel_Comics.csv';
    const dcPath = '/tmp/kaggle_dc_comics/Complete_DC_Comic_Books.csv';
    
    const marvelResult = await service.processMarvelComics(marvelPath);
    const dcResult = await service.processDCComics(dcPath);
    
    res.json({
      marvel: marvelResult,
      dc: dcResult,
      total: {
        inserted: marvelResult.inserted + dcResult.inserted,
        skipped: marvelResult.skipped + dcResult.skipped,
        errors: marvelResult.errors + dcResult.errors
      }
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router;
