const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export const api = {
  /**
   * Health check endpoint
   */
  async getHealth() {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.json();
  },

  /**
   * Fetches latest evaluated acute stress state
   */
  async getCurrentStressState() {
    const res = await fetch(`${API_BASE_URL}/api/stress/current`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  /**
   * Fetches clinical validation and market-ready model metrics
   */
  async getModelMetrics() {
    const res = await fetch(`${API_BASE_URL}/api/stress/model/metrics`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  /**
   * Fetches historical stress assessments
   */
  async getStressHistory(subjectId, limit = 50) {
    const res = await fetch(`${API_BASE_URL}/api/stress/history/${subjectId}?limit=${limit}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  /**
   * Fetches recent physiological telemetry records
   */
  async getRecentTelemetry(subjectId, limit = 100) {
    const res = await fetch(`${API_BASE_URL}/api/telemetry/recent/${subjectId}?limit=${limit}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  /**
   * Ingests a manual sensor telemetry frame
   */
  async ingestTelemetry(data) {
    const res = await fetch(`${API_BASE_URL}/api/telemetry/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  /**
   * Switches active classification algorithm (random_forest or svm)
   */
  async selectClassifier(modelName) {
    const res = await fetch(`${API_BASE_URL}/api/stress/model/select?model_name=${modelName}`, {
      method: 'POST'
    });
    return res.json();
  },

  /**
   * Injects simulation stress factor (0.0 relaxed to 1.0 peak)
   */
  async setStressBias(bias) {
    const res = await fetch(`${API_BASE_URL}/api/simulation/stress-bias?bias=${bias}`, {
      method: 'POST'
    });
    return res.json();
  }
};
