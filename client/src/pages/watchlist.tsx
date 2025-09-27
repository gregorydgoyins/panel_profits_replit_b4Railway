export default function WatchlistPage() {
  return (
    <div className="space-y-6" data-testid="page-watchlist">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Watchlist</h1>
      </div>
      <div className="grid gap-6">
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">Market Watchlist</h2>
          <p className="text-muted-foreground">
            Track your favorite comic book assets with real-time price alerts, technical indicators, and market sentiment analysis.
          </p>
        </div>
      </div>
    </div>
  );
}