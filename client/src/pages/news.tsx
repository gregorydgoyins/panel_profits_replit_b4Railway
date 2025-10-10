export default function NewsPage() {
  return (
    <div className="space-y-6" data-testid="page-news">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl ">Market News</h1>
      </div>
      <div className="grid gap-6">
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl  mb-4">Latest Market Updates</h2>
          <p className="text-muted-foreground">
            Stay informed with the latest comic book market news, industry developments, and price-moving events affecting your investments.
          </p>
        </div>
      </div>
    </div>
  );
}