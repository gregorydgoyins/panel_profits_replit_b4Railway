const express = require('express');
const cors = require('cors');
const compression = require('compression');

const app = express();
app.use(cors());
app.use(compression());
app.use(express.json());

app.get('/__health', (_req, res) => {
  res.json({ ok: true, service: 'api', time: new Date().toISOString() });
});

// TODO: mount your real routes here under /api
// app.use('/api', require('./routes'))

const PORT = Number(process.env.PORT || 8080);
app.listen(PORT, '0.0.0.0', () => console.log(`✅ API listening on ${PORT}`));
