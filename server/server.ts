
app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "panel-profits-backend", time: Date.now() });
});

