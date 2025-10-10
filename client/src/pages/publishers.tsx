export default function PublishersPage() {
  return (
    <div className="space-y-6" data-testid="page-publishers">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl ">Publisher Assets</h1>
      </div>
      <div className="grid gap-6">
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl  mb-4">Publisher Performance</h2>
          <p className="text-muted-foreground">
            Trade publisher-based assets including Marvel, DC, Image, and independent publishers. Analyze market trends and publisher performance metrics.
          </p>
        </div>
      </div>
    </div>
  );
}