export default function PortfolioPage() {
  return (
    <div className="space-y-6" data-testid="page-portfolio">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Portfolio Management</h1>
      </div>
      <div className="grid gap-6">
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">Your Holdings</h2>
          <p className="text-muted-foreground">
            Comprehensive portfolio management with performance analytics, risk assessment, and diversification insights for your comic book investments.
          </p>
        </div>
      </div>
    </div>
  );
}