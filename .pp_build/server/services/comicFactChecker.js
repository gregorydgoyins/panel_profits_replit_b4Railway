"use strict";
/**
 * Comic Fact Checker Service
 *
 * Verifies all facts about a comic before it's displayed to users.
 * Ensures production-quality accuracy for Comic of the Day widget.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.comicFactChecker = exports.ComicFactChecker = void 0;
class ComicFactChecker {
    /**
     * Main fact-checking method
     * Validates all comic facts and corrects errors
     */
    async verifyComicFacts(comic) {
        const errors = [];
        const warnings = [];
        const correctedFacts = {};
        // 1. CRITICAL: Verify First Issue claim
        const firstIssueCheck = this.verifyFirstIssue(comic);
        if (firstIssueCheck.error) {
            errors.push(firstIssueCheck.error);
            correctedFacts.isFirstIssue = firstIssueCheck.corrected;
        }
        // 2. Verify Key Issue claim
        const keyIssueCheck = this.verifyKeyIssue(comic);
        if (keyIssueCheck.warning) {
            warnings.push(keyIssueCheck.warning);
        }
        if (keyIssueCheck.corrected !== undefined) {
            correctedFacts.isKeyIssue = keyIssueCheck.corrected;
        }
        // 3. Verify creator information
        const creatorCheck = this.verifyCreators(comic);
        if (creatorCheck.error) {
            errors.push(creatorCheck.error);
        }
        // 4. Verify page count is reasonable
        const pageCountCheck = this.verifyPageCount(comic);
        if (pageCountCheck.error) {
            errors.push(pageCountCheck.error);
            correctedFacts.pageCount = pageCountCheck.corrected;
        }
        // 5. Verify publication date is valid
        const dateCheck = this.verifyPublicationDate(comic);
        if (dateCheck.error) {
            errors.push(dateCheck.error);
        }
        // 6. Verify description quality
        const descriptionCheck = this.verifyDescription(comic);
        if (descriptionCheck.warning) {
            warnings.push(descriptionCheck.warning);
        }
        const passed = errors.length === 0;
        return {
            passed,
            errors,
            warnings,
            correctedFacts
        };
    }
    /**
     * CRITICAL: Verify "First Issue" claim
     * This is the most important check - must be 100% accurate
     */
    verifyFirstIssue(comic) {
        // A comic is ONLY a first issue if issueNumber === 1
        // No exceptions, no shortcuts
        const actuallyFirstIssue = comic.issueNumber === 1;
        if (comic.isFirstIssue !== actuallyFirstIssue) {
            const error = comic.isFirstIssue
                ? `CRITICAL: ${comic.series} #${comic.issueNumber} is falsely marked as "First Issue" - it's issue ${comic.issueNumber}, not #1`
                : `Issue #${comic.issueNumber} should be marked as first issue but isn't`;
            return { error, corrected: actuallyFirstIssue };
        }
        return { corrected: actuallyFirstIssue };
    }
    /**
     * Verify "Key Issue" designation
     * Key issues include: #1s, first appearances, major story events
     */
    verifyKeyIssue(comic) {
        // First issues are always key issues
        if (comic.issueNumber === 1 && !comic.isKeyIssue) {
            return {
                warning: `Issue #1 should be marked as key issue`,
                corrected: true
            };
        }
        // Check for "first appearance" indicators in description
        const hasFirstAppearance = comic.description?.toLowerCase().includes('first appearance');
        if (hasFirstAppearance && !comic.isKeyIssue) {
            return {
                warning: `Contains first appearance but not marked as key issue`,
                corrected: true
            };
        }
        return {};
    }
    /**
     * Verify creator information is present and valid
     */
    verifyCreators(comic) {
        if (!comic.creators || comic.creators.length === 0) {
            return { error: `No creator information available for ${comic.title}` };
        }
        // Check for placeholder/generic creator names
        const hasGenericCreators = comic.creators.some(c => c.name.toLowerCase().includes('unknown') ||
            c.name.toLowerCase().includes('various') ||
            c.name === '');
        if (hasGenericCreators) {
            return { error: `Generic/placeholder creator names detected` };
        }
        return {};
    }
    /**
     * Verify page count is within reasonable bounds
     */
    verifyPageCount(comic) {
        const pageCount = comic.pageCount;
        // Standard comic page counts: 20-48 pages (most common)
        // Graphic novels/annuals: 48-200+ pages
        // Anything outside 1-500 is likely an error
        if (pageCount < 1 || pageCount > 500) {
            return {
                error: `Unrealistic page count: ${pageCount} pages`,
                corrected: 32 // Standard comic length
            };
        }
        if (pageCount === 0) {
            return {
                error: `Page count missing`,
                corrected: 32
            };
        }
        return {};
    }
    /**
     * Verify publication date is valid
     */
    verifyPublicationDate(comic) {
        if (!comic.onsaleDate) {
            return { error: `Missing publication date` };
        }
        const date = new Date(comic.onsaleDate);
        const currentDate = new Date();
        const earliestComicDate = new Date('1933-01-01'); // Before Superman (1938)
        if (date < earliestComicDate) {
            return { error: `Publication date ${comic.onsaleDate} predates comic book era` };
        }
        if (date > currentDate) {
            return { error: `Publication date ${comic.onsaleDate} is in the future` };
        }
        return {};
    }
    /**
     * Verify description quality and accuracy
     */
    verifyDescription(comic) {
        if (!comic.description || comic.description.trim().length === 0) {
            return { warning: `No description available for ${comic.title}` };
        }
        // Check for placeholder descriptions
        const placeholderPhrases = [
            'no description available',
            'coming soon',
            'to be announced',
            'lorem ipsum'
        ];
        const hasPlaceholder = placeholderPhrases.some(phrase => comic.description.toLowerCase().includes(phrase));
        if (hasPlaceholder) {
            return { warning: `Description contains placeholder text` };
        }
        // Very short descriptions might be incomplete
        if (comic.description.length < 50) {
            return { warning: `Description unusually short (${comic.description.length} chars)` };
        }
        return {};
    }
    /**
     * Apply corrections to comic data
     */
    applyCorrections(comic, corrections) {
        return {
            ...comic,
            ...corrections
        };
    }
    /**
     * Log fact-check results for monitoring
     */
    logFactCheckResults(comic, result) {
        if (!result.passed) {
            console.error(`❌ FACT CHECK FAILED for ${comic.series} #${comic.issueNumber}:`);
            result.errors.forEach(error => console.error(`  - ${error}`));
        }
        if (result.warnings.length > 0) {
            console.warn(`⚠️ FACT CHECK WARNINGS for ${comic.series} #${comic.issueNumber}:`);
            result.warnings.forEach(warning => console.warn(`  - ${warning}`));
        }
        if (result.passed && result.warnings.length === 0) {
            console.log(`✅ FACT CHECK PASSED for ${comic.series} #${comic.issueNumber}`);
        }
    }
}
exports.ComicFactChecker = ComicFactChecker;
exports.comicFactChecker = new ComicFactChecker();
