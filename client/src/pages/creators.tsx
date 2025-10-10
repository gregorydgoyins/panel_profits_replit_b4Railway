export default function CreatorsPage() {
  return (
    <div className="space-y-6" data-testid="page-creators">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl ">Creator Assets</h1>
      </div>
      <div className="grid gap-6">
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl  mb-4">Creator Portfolio Trading</h2>
          <p className="text-muted-foreground">
            Trade assets based on comic book creators including writers, artists, and industry legends. Track creator performance and market influence.
          </p>
        </div>
      </div>
    </div>
  );
}