export default function CalendarPage() {
  return (
    <div className="space-y-6" data-testid="page-calendar">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Market Calendar</h1>
      </div>
      <div className="grid gap-6">
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          <p className="text-muted-foreground">
            Track important dates including comic release schedules, movie announcements, convention dates, and other market-moving events.
          </p>
        </div>
      </div>
    </div>
  );
}