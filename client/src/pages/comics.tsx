export default function ComicsPage() {
  return (
    <div className="space-y-6" data-testid="page-comics">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Key Comics</h1>
      </div>
      <div className="grid gap-6">
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">Key Issue Trading</h2>
          <p className="text-muted-foreground">
            Discover and trade key comic book issues including first appearances, origin stories, and significant storylines. Advanced market analysis and price tracking.
          </p>
        </div>
      </div>
    </div>
  );
}