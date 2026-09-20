/**
 * GeoShield AI — Beacons Route
 * Language: JavaScript (Node.js)
 * GET /api/beacons — Returns LoRa mesh beacon node status
 */

const express = require('express');
const router = express.Router();

const BASE_BEACONS = [
  {
    id: 'GS-B01',
    name: 'GeoShield Beacon #1',
    village: 'Burtuk Village, East Sikkim',
    lat: 27.3516, lng: 88.6138,
    riskLevel: 'CRITICAL', score: 91,
    soilMoisture: '94%', slope: '42°', rainfall: '312 mm',
    battery: 78, signal: -72, online: true,
  },
  {
    id: 'GS-B02',
    name: 'GeoShield Beacon #2',
    village: 'Tadong Slope, Gangtok',
    lat: 27.3389, lng: 88.6065,
    riskLevel: 'HIGH', score: 74,
    soilMoisture: '88%', slope: '38°', rainfall: '287 mm',
    battery: 92, signal: -68, online: true,
  },
  {
    id: 'GS-B03',
    name: 'GeoShield Beacon #3',
    village: 'Mangan Valley, North Sikkim',
    lat: 27.5088, lng: 88.5368,
    riskLevel: 'MODERATE', score: 48,
    soilMoisture: '76%', slope: '28°', rainfall: '198 mm',
    battery: 65, signal: -81, online: true,
  },
  {
    id: 'GS-B04',
    name: 'GeoShield Beacon #4',
    village: 'Gangtok Urban Core',
    lat: 27.3314, lng: 88.6138,
    riskLevel: 'HIGH', score: 62,
    soilMoisture: '88%', slope: '31°', rainfall: '268 mm',
    battery: 88, signal: -65, online: true,
  },
];

router.get('/', (req, res) => {
  // Add slight fluctuation to simulate live data
  const beacons = BASE_BEACONS.map(b => ({
    ...b,
    signal: b.signal + Math.floor(Math.random() * 5 - 2),
    battery: Math.max(10, b.battery - Math.floor(Math.random() * 2)),
  }));
  res.json({ count: beacons.length, beacons });
});

router.get('/:id', (req, res) => {
  const beacon = BASE_BEACONS.find(b => b.id === req.params.id);
  if (!beacon) return res.status(404).json({ error: 'Beacon not found' });
  res.json(beacon);
});

module.exports = router;
