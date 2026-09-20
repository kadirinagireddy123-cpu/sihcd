/**
 * GeoShield AI — Node.js Express API Gateway
 * Language: JavaScript (Node.js)
 * Port: 5000
 *
 * Responsibilities:
 *  - REST API for alerts, roads, beacons
 *  - WebSocket server for real-time telemetry streaming
 *  - Proxies risk scoring requests to Python FastAPI (port 8000)
 */

const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const axios = require('axios');

const alertsRouter = require('./routes/alerts');
const roadsRouter = require('./routes/roads');
const beaconsRouter = require('./routes/beacons');

const PORT = 5000;
const PYTHON_API = 'http://localhost:8000';

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// ─── REST Routes ────────────────────────────────────────────────────────────
app.use('/api/alerts',  alertsRouter);
app.use('/api/roads',   roadsRouter);
app.use('/api/beacons', beaconsRouter);

// Proxy to Python AI engine
app.get('/api/weather', async (req, res) => {
  try {
    const { data } = await axios.get(`${PYTHON_API}/weather`);
    res.json(data);
  } catch {
    res.status(503).json({ error: 'AI engine unavailable' });
  }
});

app.post('/api/score', async (req, res) => {
  try {
    const { data } = await axios.post(`${PYTHON_API}/score`, req.body);
    res.json(data);
  } catch {
    res.status(503).json({ error: 'AI engine unavailable' });
  }
});

app.get('/api/incidents', async (req, res) => {
  try {
    const { data } = await axios.get(`${PYTHON_API}/incidents`);
    res.json(data);
  } catch {
    res.status(503).json({ error: 'AI engine unavailable' });
  }
});

app.post('/api/incidents', async (req, res) => {
  try {
    const { data } = await axios.post(`${PYTHON_API}/incidents`, req.body);
    res.json(data);
  } catch {
    res.status(503).json({ error: 'AI engine unavailable' });
  }
});

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'GeoShield API Gateway', lang: 'Node.js' }));

// ─── WebSocket Server (Real-Time Telemetry Streaming) ────────────────────────
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws' });

// Simulates LoRa sensor beacon telemetry — 4 beacons
let telemetry = { rainfall: 168.4, soilMoisture: 92, rssi: -78, meshPing: 14 };

function fluctuate(val, min, max, step = 1) {
  const delta = (Math.random() > 0.5 ? step : -step) * Math.random();
  return parseFloat(Math.max(min, Math.min(max, val + delta)).toFixed(1));
}

function updateTelemetry() {
  telemetry = {
    rainfall:     fluctuate(telemetry.rainfall,     100, 250,  0.5),
    soilMoisture: fluctuate(telemetry.soilMoisture,  80,  99,  1),
    rssi:         fluctuate(telemetry.rssi,         -90, -60,  1),
    meshPing:     fluctuate(telemetry.meshPing,        8,  25,  1),
    timestamp:    new Date().toISOString(),
  };
}

// Broadcast to all connected WebSocket clients every 3 seconds
setInterval(() => {
  updateTelemetry();
  const payload = JSON.stringify({ type: 'TELEMETRY', data: telemetry });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) client.send(payload);
  });
}, 3000);

wss.on('connection', (ws) => {
  console.log('[WS] Client connected — sending initial telemetry');
  ws.send(JSON.stringify({ type: 'TELEMETRY', data: telemetry }));
});

// ─── Start ───────────────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`\n🟢 GeoShield API Gateway (Node.js) running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket telemetry at ws://localhost:${PORT}/ws`);
  console.log(`📡 Proxying /api/weather and /api/score → Python :8000\n`);
});
