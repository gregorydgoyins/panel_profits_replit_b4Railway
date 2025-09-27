import { useCallback, useEffect, useRef, useState } from "react";

export type MarketInsight = {
  symbol: string;
  score: number;
  summary: string;
  details: string;
};

export type UseMarketInsightsArgs = {
  symbols: string[];
  enabled?: boolean;
  fetcher?: (symbols: string[], signal: AbortSignal) => Promise<MarketInsight[]>;
};

export function useMarketInsights({
  symbols,
  enabled = true,
  fetcher = defaultFetcher,
}: UseMarketInsightsArgs) {
  const [data, setData] = useState<MarketInsight[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const lastReq = useRef(0);

  const load = useCallback(async () => {
    if (!enabled) return;

    const reqId = Date.now();
    lastReq.current = reqId;
    setLoading(true);
    setError(null);

    const ctrl = new AbortController();
    try {
      const result = await fetcher(symbols, ctrl.signal);
      if (lastReq.current === reqId) setData(result);
    } catch (e) {
      if ((e as any)?.name !== "AbortError") setError(e as Error);
    } finally {
      if (lastReq.current === reqId) setLoading(false);
    }
    return () => ctrl.abort();
  }, [enabled, fetcher, symbols]);

  useEffect(() => {
    if (!enabled) return;
    let disposed = false;
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);

    fetcher(symbols, ctrl.signal)
      .then((res) => {
        if (!disposed) setData(res);
      })
      .catch((e) => {
        if (!disposed && (e as any)?.name !== "AbortError") setError(e as Error);
      })
      .finally(() => {
        if (!disposed) setLoading(false);
      });

    return () => {
      disposed = true;
      ctrl.abort();
    };
  }, [enabled, fetcher, symbols]);

  const refresh = useCallback(() => {
    void load();
  }, [load]);

  return { data, error, loading, refresh } as const;
}

async function defaultFetcher(symbols: string[], signal: AbortSignal) {
  await new Promise((r) => setTimeout(r, 250));
  if (signal.aborted) throw new Error('Request aborted');
  
  const comicInsights = [
    {
      symbol: 'ASM300',
      score: 0.92,
      summary: 'Venom movie sequel driving strong demand for first full appearance',
      details: 'Amazing Spider-Man #300 showing exceptional momentum following Sony\'s Venom 3 announcement. Technical indicators suggest breakout above CC 2,700.'
    },
    {
      symbol: 'SPDR',
      score: 0.88,
      summary: 'Spider-Man character stock benefiting from multiverse expansion',
      details: 'Strong correlation with media announcements. Volume surge indicates institutional accumulation ahead of Spider-Man 4 production.'
    },
    {
      symbol: 'TMFS',
      score: 0.85,
      summary: 'Todd McFarlane showing creator premium with Spawn Universe growth',
      details: 'Creator stock outperforming sector average. Upcoming milestone issue #350 expected to drive additional interest.'
    },
    {
      symbol: 'BATM',
      score: 0.82,
      summary: 'Batman maintaining stability with steady media presence',
      details: 'Consistent performer with low volatility. The Batman Part II announcement providing steady upward pressure.'
    },
    {
      symbol: 'AF15',
      score: 0.95,
      summary: 'Amazing Fantasy #15 showing legendary status with scarcity premium',
      details: 'First Spider-Man appearance commanding record prices. Limited high-grade supply supporting continued appreciation.'
    }
  ];
  
  if (symbols.length === 0 || symbols[0] === '') {
    return comicInsights.slice(0, 5);
  }
  
  return symbols.map(s => {
    const insight = comicInsights.find(ci => ci.symbol === s);
    return insight || {
      symbol: s,
      score: 0.7 + Math.random() * 0.25,
      summary: `Market outlook for ${s} based on recent trading patterns`,
      details: `Technical analysis for ${s} suggests current momentum and volume trends indicate ${Math.random() > 0.5 ? 'bullish' : 'cautious'} sentiment.`
    };
  });
}

declare global {
  interface AbortSignal {
    aborted: boolean;
  }
}