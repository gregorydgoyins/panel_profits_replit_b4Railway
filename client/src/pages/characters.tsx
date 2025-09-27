export default function CharactersPage() {
  return (
    <div className="space-y-6" data-testid="page-characters">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Character Assets</h1>
      </div>
      <div className="grid gap-6">
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">Comic Book Characters</h2>
          <p className="text-muted-foreground">
            Trade character-based assets including first appearances, key storylines, and character developments. Market analysis for popular superhero franchises.
          </p>
        </div>
      </div>
    </div>
  );
}