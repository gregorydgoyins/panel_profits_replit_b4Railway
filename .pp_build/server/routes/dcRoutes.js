"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dcMultiSourceExpansion_1 = require("../services/dcMultiSourceExpansion");
const router = (0, express_1.Router)();
/**
 * Get DC multi-source status
 */
router.get('/status', async (req, res) => {
    try {
        // Test connections to both Metron and GCD
        const [metronTest, gcdTest] = await Promise.all([
            dcMultiSourceExpansion_1.dcMultiSourceExpansionService.fetchMetronCharacters(1, 0).catch(e => ({ error: e.message })),
            dcMultiSourceExpansion_1.dcMultiSourceExpansionService.fetchGCDIssues(1, 0).catch(e => ({ error: e.message }))
        ]);
        const metronConnected = !('error' in metronTest);
        const gcdConnected = !('error' in gcdTest);
        res.json({
            success: metronConnected || gcdConnected,
            sources: {
                metron: {
                    connected: metronConnected,
                    totalCharacters: metronConnected ? metronTest.count : 0,
                    error: metronConnected ? undefined : metronTest.error
                },
                gcd: {
                    connected: gcdConnected,
                    totalIssues: gcdConnected ? gcdTest.count : 0,
                    error: gcdConnected ? undefined : gcdTest.error
                }
            },
            message: `DC multi-source: Metron ${metronConnected ? '✓' : '✗'} | GCD ${gcdConnected ? '✓' : '✗'}`
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
/**
 * Expand DC characters from Metron
 * Query params:
 *   - startOffset: Starting offset (default: 0)
 *   - maxToProcess: Max items to process (default: 1000)
 */
router.post('/expand/metron/characters', async (req, res) => {
    try {
        const startOffset = parseInt(req.query.startOffset) || 0;
        const maxToProcess = parseInt(req.query.maxToProcess) || 1000;
        console.log(`\n🦸 Starting Metron DC character expansion`);
        console.log(`   Start Offset: ${startOffset}`);
        console.log(`   Max To Process: ${maxToProcess}`);
        const progress = await dcMultiSourceExpansion_1.dcMultiSourceExpansionService.expandMetronCharacters(startOffset, maxToProcess);
        res.json({
            success: true,
            progress
        });
    }
    catch (error) {
        console.error('❌ Metron character expansion error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
/**
 * Expand DC comics from GCD
 * Query params:
 *   - startOffset: Starting offset (default: 0)
 *   - maxToProcess: Max items to process (default: 1000)
 */
router.post('/expand/gcd/issues', async (req, res) => {
    try {
        const startOffset = parseInt(req.query.startOffset) || 0;
        const maxToProcess = parseInt(req.query.maxToProcess) || 1000;
        console.log(`\n📚 Starting GCD DC issue expansion`);
        console.log(`   Start Offset: ${startOffset}`);
        console.log(`   Max To Process: ${maxToProcess}`);
        const progress = await dcMultiSourceExpansion_1.dcMultiSourceExpansionService.expandGCDIssues(startOffset, maxToProcess);
        res.json({
            success: true,
            progress
        });
    }
    catch (error) {
        console.error('❌ GCD issue expansion error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
/**
 * Test endpoint - test both sources without inserting
 */
router.get('/test/sources', async (req, res) => {
    try {
        const [metronChars, gcdIssues] = await Promise.all([
            dcMultiSourceExpansion_1.dcMultiSourceExpansionService.fetchMetronCharacters(3, 0),
            dcMultiSourceExpansion_1.dcMultiSourceExpansionService.fetchGCDIssues(3, 0)
        ]);
        res.json({
            success: true,
            metron: {
                totalCharacters: metronChars.count,
                sample: metronChars.results.map(c => ({
                    id: c.id,
                    name: c.name,
                    alias: c.alias
                }))
            },
            gcd: {
                totalIssues: gcdIssues.count,
                sample: gcdIssues.results.map(i => ({
                    id: i.id,
                    series: i.series.name,
                    number: i.number,
                    publisher: i.series.publisher.name
                }))
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
exports.default = router;
