"use strict";
/**
 * Resilient API Client Service
 *
 * Industrial-strength API client with:
 * - Exponential backoff retry logic
 * - Circuit breaker pattern
 * - Request rate limiting
 * - Per-source error categorization
 * - Configurable fallbacks
 *
 * For 401,666 assets, we need reliable data fetching even when upstream APIs fail.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.resilientApiClient = exports.ResilientApiClient = void 0;
var CircuitState;
(function (CircuitState) {
    CircuitState["CLOSED"] = "closed";
    CircuitState["OPEN"] = "open";
    CircuitState["HALF_OPEN"] = "half_open";
})(CircuitState || (CircuitState = {}));
class CircuitBreaker {
    constructor(name, config) {
        this.name = name;
        this.config = config;
        this.state = CircuitState.CLOSED;
        this.failureCount = 0;
        this.successCount = 0;
        this.nextAttempt = Date.now();
    }
    async execute(fn) {
        if (this.state === CircuitState.OPEN) {
            if (Date.now() < this.nextAttempt) {
                throw new Error(`Circuit breaker OPEN for ${this.name}`);
            }
            this.state = CircuitState.HALF_OPEN;
        }
        try {
            const result = await fn();
            this.onSuccess();
            return result;
        }
        catch (error) {
            this.onFailure();
            throw error;
        }
    }
    onSuccess() {
        this.failureCount = 0;
        if (this.state === CircuitState.HALF_OPEN) {
            this.successCount++;
            if (this.successCount >= this.config.successThreshold) {
                this.state = CircuitState.CLOSED;
                this.successCount = 0;
            }
        }
    }
    onFailure() {
        this.failureCount++;
        this.successCount = 0;
        if (this.failureCount >= this.config.failureThreshold) {
            this.state = CircuitState.OPEN;
            this.nextAttempt = Date.now() + this.config.timeout;
            console.warn(`Circuit breaker OPEN for ${this.name} - next attempt in ${this.config.timeout}ms`);
        }
    }
    getState() {
        return {
            name: this.name,
            state: this.state,
            failureCount: this.failureCount,
            successCount: this.successCount,
        };
    }
    reset() {
        this.state = CircuitState.CLOSED;
        this.failureCount = 0;
        this.successCount = 0;
        this.nextAttempt = Date.now();
    }
}
class ResilientApiClient {
    constructor() {
        this.circuitBreakers = new Map();
        this.defaultRetryConfig = {
            maxAttempts: 3,
            initialDelay: 1000,
            maxDelay: 30000,
            backoffMultiplier: 2,
        };
        this.defaultCircuitConfig = {
            failureThreshold: 5,
            successThreshold: 2,
            timeout: 60000, // 1 minute
        };
        this.initializeCircuitBreakers();
    }
    initializeCircuitBreakers() {
        const sources = ['marvel', 'superhero', 'metron', 'gcd'];
        sources.forEach(source => {
            this.circuitBreakers.set(source, new CircuitBreaker(source, this.defaultCircuitConfig));
        });
    }
    categorizeError(error, source) {
        const statusCode = error.status || error.statusCode;
        const message = error.message?.toLowerCase() || '';
        if (statusCode === 401 || statusCode === 403 || message.includes('unauthorized') || message.includes('forbidden')) {
            return { type: 'auth', retryable: false, severity: 'high' };
        }
        if (statusCode === 429 || message.includes('rate limit') || message.includes('too many requests')) {
            return { type: 'rate_limit', retryable: true, severity: 'medium' };
        }
        if (statusCode === 404 || message.includes('not found')) {
            return { type: 'not_found', retryable: false, severity: 'low' };
        }
        if (statusCode === 302 || statusCode === 301) {
            return { type: 'network', retryable: true, severity: 'medium' };
        }
        if (statusCode >= 500 || message.includes('server error') || message.includes('internal error')) {
            return { type: 'server_error', retryable: true, severity: 'high' };
        }
        if (message.includes('timeout') || message.includes('econnrefused') || message.includes('network')) {
            return { type: 'network', retryable: true, severity: 'medium' };
        }
        return { type: 'unknown', retryable: false, severity: 'medium' };
    }
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    calculateDelay(attempt, config) {
        const delay = Math.min(config.initialDelay * Math.pow(config.backoffMultiplier, attempt - 1), config.maxDelay);
        const jitter = delay * 0.1 * Math.random();
        return delay + jitter;
    }
    async fetchWithResilience(source, fetchFn, retryConfig = {}) {
        const config = { ...this.defaultRetryConfig, ...retryConfig };
        const circuitBreaker = this.circuitBreakers.get(source);
        if (!circuitBreaker) {
            console.warn(`No circuit breaker found for source: ${source}`);
        }
        let lastError = null;
        let attempts = 0;
        for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
            attempts = attempt;
            try {
                if (circuitBreaker) {
                    const data = await circuitBreaker.execute(fetchFn);
                    return { data, error: null, attempts };
                }
                else {
                    const data = await fetchFn();
                    return { data, error: null, attempts };
                }
            }
            catch (error) {
                lastError = error;
                const errorCategory = this.categorizeError(error, source);
                console.warn(`[${source}] Attempt ${attempt}/${config.maxAttempts} failed:`, {
                    type: errorCategory.type,
                    retryable: errorCategory.retryable,
                    severity: errorCategory.severity,
                    message: error.message,
                });
                if (!errorCategory.retryable || attempt === config.maxAttempts) {
                    return { data: null, error: errorCategory, attempts };
                }
                const delay = this.calculateDelay(attempt, config);
                console.log(`[${source}] Retrying in ${Math.round(delay)}ms...`);
                await this.sleep(delay);
            }
        }
        const finalError = this.categorizeError(lastError, source);
        return { data: null, error: finalError, attempts };
    }
    getCircuitBreakerStatus() {
        const status = {};
        this.circuitBreakers.forEach((breaker, name) => {
            status[name] = breaker.getState();
        });
        return status;
    }
    resetCircuitBreaker(source) {
        const breaker = this.circuitBreakers.get(source);
        if (breaker) {
            breaker.reset();
            console.log(`Circuit breaker reset for: ${source}`);
        }
    }
    resetAllCircuitBreakers() {
        this.circuitBreakers.forEach((breaker, source) => {
            breaker.reset();
        });
        console.log('All circuit breakers reset');
    }
}
exports.ResilientApiClient = ResilientApiClient;
exports.resilientApiClient = new ResilientApiClient();
