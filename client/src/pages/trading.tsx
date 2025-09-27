export default function TradingPage() {
  return (
    <div className="space-y-6" data-testid="page-trading">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Trading Desk</h1>
      </div>
      <div className="grid gap-6">
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">Order Management</h2>
          <p className="text-muted-foreground">
            Professional trading interface coming soon. Execute buy/sell orders for comic book assets with advanced order types and real-time market data.
          </p>
        </div>
      </div>
    </div>
  );
}