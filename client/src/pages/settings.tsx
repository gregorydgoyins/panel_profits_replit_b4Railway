export default function SettingsPage() {
  return (
    <div className="space-y-6" data-testid="page-settings">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      <div className="grid gap-6">
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">Platform Configuration</h2>
          <p className="text-muted-foreground">
            Customize your trading platform experience with preferences for alerts, display options, and account settings.
          </p>
        </div>
      </div>
    </div>
  );
}