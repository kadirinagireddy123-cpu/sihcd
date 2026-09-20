/**
 * GeoShield AI — Alerts Route
 * Language: JavaScript (Node.js)
 * GET /api/alerts — Returns active disaster alerts
 */

const express = require('express');
const router = express.Router();

const ALERTS = [
  {
    id: 1,
    type: 'INTERNATIONAL',
    title: 'Nepal-Tibet Glacier Collapse — Flash Floods',
    message: 'Devastating flash floods triggered by glacier collapse on the Nepal-Tibet border on August 26, 2026 have killed at least 626 people in Nepal, with nearly 2,000 reported missing. Massive wave of water, ice, and debris traveled down the Bhote Koshi River valley, destroying villages, the Gyirong Port trade link, and critical infrastructure across Rasuwa and Nuwakot districts.',
    district: 'Rasuwa & Nuwakot',
    state: 'Nepal',
    level: 'CRITICAL',
    source: 'International Disaster Alert',
    icon: '🔴',
    active: true,
  },
  {
    id: 2,
    type: 'IMD_WARNING',
    title: 'Heavy Monsoonal Downpour (145mm/24h)',
    message: 'IMD has issued Red Alert for extremely heavy rainfall across Sikkim and Meghalaya slopes. Landslide probability >80%.',
    district: 'Gangtok',
    state: 'Sikkim',
    level: 'RED',
    source: 'IMD',
    icon: '⚠️',
    active: true,
  },
  {
    id: 3,
    type: 'BEACON_ALERT',
    title: 'Soil Saturation Critical — Beacon #4 Gangtok',
    message: 'GeoShield Beacon #4 at Gangtok reports soil saturation at 88%. LoRa local sirens in standby mode.',
    district: 'Gangtok',
    state: 'Sikkim',
    level: 'RED',
    source: 'GeoShield Beacon',
    icon: '🛡️',
    active: true,
  },
  {
    id: 4,
    type: 'DRONE_UPDATE',
    title: 'Patrol Drone #02 — Live Thermal Scan Active',
    message: 'YOLOv11 Drone #02 live thermal scanner active over slope coordinates 27.33°N, 88.61°E.',
    district: 'Tadong Sector',
    state: 'Sikkim',
    level: 'YELLOW',
    source: 'GeoShield Drone Fleet',
    icon: '🚁',
    active: true,
  },
  {
    id: 5,
    type: 'ROUTE_UPDATE',
    title: 'SafePath AI — Route 3 (North Sector Highway) Cleared',
    message: 'North Sector Highway cleared for emergency responder convoy by SafePath AI routing engine.',
    district: 'North Sector',
    state: 'Sikkim',
    level: 'GREEN',
    source: 'SafePath AI',
    icon: '✅',
    active: true,
  },
];

router.get('/', (req, res) => {
  const { level } = req.query;
  const results = level
    ? ALERTS.filter(a => a.level === level.toUpperCase() && a.active)
    : ALERTS.filter(a => a.active);
  res.json({ count: results.length, alerts: results });
});

router.get('/:id', (req, res) => {
  const alert = ALERTS.find(a => a.id === parseInt(req.params.id));
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  res.json(alert);
});

module.exports = router;
