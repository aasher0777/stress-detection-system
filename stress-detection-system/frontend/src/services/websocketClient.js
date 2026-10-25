/**
 * WebSocket client for real-time telemetry streaming with auto-reconnect and synthetic fallback.
 */
export class TelemetryWebSocketClient {
  constructor(url = 'ws://localhost:8000/ws/telemetry') {
    this.url = url;
    this.ws = null;
    this.listeners = new Set();
    this.reconnectTimer = null;
    this.isManualClose = false;
    this.fallbackTimer = null;
  }

  connect() {
    this.isManualClose = false;
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('[*] Connected to Telemetry WebSocket stream');
        if (this.fallbackTimer) {
          clearInterval(this.fallbackTimer);
          this.fallbackTimer = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          this.notify(payload);
        } catch (err) {
          console.error('[!] Failed to parse WebSocket JSON payload:', err);
        }
      };

      this.ws.onclose = () => {
        console.warn('[!] Telemetry WebSocket disconnected. Scheduling reconnect...');
        if (!this.isManualClose) {
          this.reconnectTimer = setTimeout(() => this.connect(), 3000);
          this._startFallbackSimulation();
        }
      };

      this.ws.onerror = (err) => {
        console.error('[!] WebSocket encountered error:', err);
        this.ws.close();
      };
    } catch (e) {
      console.warn('[!] Could not open WebSocket. Falling back to local simulation:', e);
      this._startFallbackSimulation();
    }
  }

  _startFallbackSimulation() {
    if (this.fallbackTimer) return;
    console.log('[*] Starting local client telemetry simulation fallback');
    let step = 0;
    this.fallbackTimer = setInterval(() => {
      step += 1;
      const hr = 72 + Math.sin(step * 0.1) * 8 + (Math.random() * 2);
      const eda = 3.2 + Math.cos(step * 0.05) * 1.5 + (Math.random() * 0.2);
      const temp = 33.5 + Math.sin(step * 0.02) * 0.4;
      const isStressed = eda > 4.2;

      this.notify({
        type: 'STRESS_UPDATE',
        telemetry: {
          subject_id: 'SUBJ-DEMO',
          timestamp: new Date().toISOString(),
          heart_rate: Number(hr.toFixed(1)),
          eda: Number(eda.toFixed(2)),
          temperature: Number(temp.toFixed(1)),
          ibi: Number((60000 / hr).toFixed(1))
        },
        features: {
          mean_hr: Number(hr.toFixed(1)),
          rmssd: isStressed ? 22.4 : 45.8,
          sdnn: isStressed ? 28.1 : 52.0,
          lf_hf_ratio: isStressed ? 3.4 : 1.3,
          eda_mean: Number(eda.toFixed(2)),
          eda_scr_peaks: isStressed ? 6 : 1,
          temp_mean: Number(temp.toFixed(1))
        },
        state: {
          subject_id: 'SUBJ-DEMO',
          stress_level: isStressed ? 'HIGH_STRESS' : 'BASELINE',
          confidence: 0.88,
          classifier_used: 'random_forest',
          alert_triggered: isStressed,
          recommendation: isStressed ? 'Sustained sympathetic activation. Practice slow deep exhalations.' : null
        }
      });
    }, 1000);
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(data) {
    for (const listener of this.listeners) {
      try {
        listener(data);
      } catch (err) {
        console.error('Error in listener callback:', err);
      }
    }
  }

  disconnect() {
    this.isManualClose = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.fallbackTimer) clearInterval(this.fallbackTimer);
    if (this.ws) this.ws.close();
  }
}

export const telemetryWs = new TelemetryWebSocketClient();
