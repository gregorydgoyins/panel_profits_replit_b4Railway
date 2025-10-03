import { Router } from 'express';
import { CharacterAttributesExpansionService } from '../services/characterAttributesExpansion';

const router = Router();
const service = new CharacterAttributesExpansionService();

router.post('/superheroes/update-attributes', async (req, res) => {
  try {
    const csvPath = req.body.csvPath || '/tmp/kaggle_superheroes_nlp/superheroes_nlp_dataset.csv';
    const result = await service.processSuperheroesDataset(csvPath);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router;
