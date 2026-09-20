/**
 * GeoShield AI — useTelemetry Hook
 * Language: JavaScript (React Hook)
 *
 * Connects to the Node.js WebSocket server (ws://localhost:5000/ws)
 * and returns live sensor telemetry data.
 * Falls back to polling /api/telemetry if WebSocket fails.
 */

import { useState, useEffect, useRef } from 'react';

const WS_URL = 'ws://localhost:5000/ws';

const DEFAULT_TELEMETRY = {
  rainfall: 168.4,
  soilMoisture: 92,
  rssi: -78,
  meshPing: 14,
};

export function useTelemetry() {
  const [telemetry, setTelemetry] = useState(DEFAULT_TELEMETRY);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const retryRef = useRef(null);

  useEffect(() => {
    function connect() {
      try {
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          setConnected(true);
          console.log('[GeoShield WS] Connected to telemetry stream');
        };

        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === 'TELEMETRY') {
              setTelemetry(msg.data);
            }
          } catch (e) {
            console.warn('[GeoShield WS] Parse error', e);
          }
        };

        ws.onclose = () => {
          setConnected(false);
          console.warn('[GeoShield WS] Disconnected — retrying in 5s');
          // Auto-reconnect
          retryRef.current = setTimeout(connect, 5000);
        };

        ws.onerror = () => {
          ws.close();
        };
      } catch (err) {
        console.warn('[GeoShield WS] Connection failed — using fallback polling');
        startPollingFallback();
      }
    }

    function startPollingFallback() {
      const id = setInterval(async () => {
        try {
          const res = await fetch('/api/telemetry');
          if (res.ok) {
            const data = await res.json();
            setTelemetry(data);
          }
        } catch {
          // Silently fail — use last known values
        }
      }, 3000);
      return () => clearInterval(id);
    }

    connect();

    return () => {
      clearTimeout(retryRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  return { telemetry, connected };
}
