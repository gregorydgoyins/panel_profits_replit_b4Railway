"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const characterAttributesExpansion_1 = require("../services/characterAttributesExpansion");
const router = (0, express_1.Router)();
const service = new characterAttributesExpansion_1.CharacterAttributesExpansionService();
router.post('/superheroes/update-attributes', async (req, res) => {
    try {
        const csvPath = req.body.csvPath || '/tmp/kaggle_superheroes_nlp/superheroes_nlp_dataset.csv';
        const result = await service.processSuperheroesDataset(csvPath);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});
exports.default = router;
