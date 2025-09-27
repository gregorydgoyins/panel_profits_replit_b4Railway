export default function HelpPage() {
  return (
    <div className="space-y-6" data-testid="page-help">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Help Center</h1>
      </div>
      <div className="grid gap-6">
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">Support & Documentation</h2>
          <p className="text-muted-foreground">
            Get help with trading strategies, platform features, and technical support for the Panel Profits comic book trading simulation.
          </p>
        </div>
      </div>
    </div>
  );
}