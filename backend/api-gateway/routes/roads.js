/**
 * GeoShield AI — Roads Route
 * Language: JavaScript (Node.js)
 * GET /api/roads — Returns NER road connectivity data
 */

const express = require('express');
const router = express.Router();

const ROAD_SEGMENTS = [
  {
    id: 'NH10-A', name: 'NH-10: Siliguri – Rangpo', length: '98 km', type: 'National Highway',
    status: 'BLOCKED', risk: 92, blockage: 'Landslide debris at km 34, 2m height, full blockage',
    lastUpdate: '22 mins ago', alternateRoute: 'Available via Kalimpong bypass', vehicles: 47,
    districts: ['East Sikkim'], priority: 'CRITICAL',
  },
  {
    id: 'NH717-B', name: 'NH-717: Gangtok Ring Road', length: '42 km', type: 'State Highway',
    status: 'CAUTION', risk: 58, blockage: 'Partial debris near Tadong Slope. 1 lane open.',
    lastUpdate: '1h ago', alternateRoute: 'None available', vehicles: 23,
    districts: ['Gangtok Urban'], priority: 'HIGH',
  },
  {
    id: 'SH1-C', name: 'SH-1: Gangtok – Mangan', length: '65 km', type: 'State Highway',
    status: 'CLEAR', risk: 28, blockage: 'No active blockage. Monitor landslide zone km 18.',
    lastUpdate: '5 mins ago', alternateRoute: 'N/A', vehicles: 12,
    districts: ['North Sikkim'], priority: 'MODERATE',
  },
  {
    id: 'MDR-Burtuk', name: 'MDR: Burtuk Village Road', length: '8 km', type: 'Village Access Road',
    status: 'BLOCKED', risk: 88, blockage: 'Flash flood washed road at river crossing. Completely severed.',
    lastUpdate: '45 mins ago', alternateRoute: 'No alternate. Village isolated.', vehicles: 0,
    districts: ['Burtuk Panchayat'], priority: 'CRITICAL',
  },
  {
    id: 'SH3-Singtam', name: 'SH-3: Singtam – Jorethang', length: '54 km', type: 'State Highway',
    status: 'CAUTION', risk: 45, blockage: 'Minor rockfall reported. Clearance underway.',
    lastUpdate: '30 mins ago', alternateRoute: 'Via Namchi diversion', vehicles: 8,
    districts: ['South Sikkim'], priority: 'HIGH',
  },
  {
    id: 'NH27-D', name: 'NH-27: Siliguri – Guwahati', length: '440 km', type: 'National Highway',
    status: 'CLEAR', risk: 18, blockage: 'No active blockage. Monsoon monitoring active.',
    lastUpdate: '10 mins ago', alternateRoute: 'N/A', vehicles: 156,
    districts: ['Assam', 'West Bengal'], priority: 'LOW',
  },
  {
    id: 'MDR-Ranipool', name: 'MDR: Ranipool – Khamdong', length: '22 km', type: 'Mountain District Road',
    status: 'BLOCKED', risk: 76, blockage: 'Tree falls + slope instability. Road team deployed.',
    lastUpdate: '18 mins ago', alternateRoute: 'Under evaluation', vehicles: 3,
    districts: ['East Sikkim'], priority: 'HIGH',
  },
  {
    id: 'SH5-Lachung', name: 'SH-5: Mangan – Lachung', length: '55 km', type: 'State Highway',
    status: 'CLEAR', risk: 22, blockage: 'No current blockage. Remote monitoring only.',
    lastUpdate: '2h ago', alternateRoute: 'N/A', vehicles: 5,
    districts: ['North Sikkim'], priority: 'LOW',
  },
];

const DISPATCH_LOG = [
  { time: '18:47', action: 'SDRF team dispatched to NH-10 km 34 blockage. ETA 25 mins.', type: 'dispatch' },
  { time: '18:32', action: 'Alert SMS sent to 847 residents near MDR Burtuk Village road.', type: 'alert' },
  { time: '18:10', action: 'Traffic rerouted via Kalimpong bypass for NH-10 vehicles.', type: 'route' },
  { time: '17:55', action: 'NDRF clearance team requested for Ranipool MDR road.', type: 'dispatch' },
  { time: '17:40', action: 'Helicopter recon flight approved for isolated Burtuk village.', type: 'recon' },
  { time: '17:22', action: 'District Collector Gangtok briefed on NH-717 partial blockage.', type: 'brief' },
];

router.get('/', (req, res) => {
  const { status } = req.query;
  const roads = status
    ? ROAD_SEGMENTS.filter(r => r.status === status.toUpperCase())
    : ROAD_SEGMENTS;

  const summary = {
    blocked: ROAD_SEGMENTS.filter(r => r.status === 'BLOCKED').length,
    caution: ROAD_SEGMENTS.filter(r => r.status === 'CAUTION').length,
    clear:   ROAD_SEGMENTS.filter(r => r.status === 'CLEAR').length,
    totalVehicles: ROAD_SEGMENTS.reduce((s, r) => s + r.vehicles, 0),
  };

  res.json({ summary, roads, dispatchLog: DISPATCH_LOG });
});

router.get('/:id', (req, res) => {
  const road = ROAD_SEGMENTS.find(r => r.id === req.params.id);
  if (!road) return res.status(404).json({ error: 'Road segment not found' });
  res.json(road);
});

module.exports = router;
