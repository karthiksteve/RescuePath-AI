const API_BASE = '/api';

export const apiService = {
  async getRegions() {
    const res = await fetch(`${API_BASE}/regions`);
    if (!res.ok) throw new Error('Failed to fetch regions');
    return res.json();
  },

  async getSequentialPrediction(regionId = 'kerala_ernakulam') {
    const res = await fetch(`${API_BASE}/sequential/predict?region_id=${regionId}`);
    if (!res.ok) throw new Error('Failed to fetch sequential prediction');
    return res.json();
  },

  async getSpatialClusters(regionId = 'kerala_ernakulam', epsKm = 1.8, minSamples = 3) {
    const res = await fetch(`${API_BASE}/spatial/clusters?region_id=${regionId}&eps_km=${epsKm}&min_samples=${minSamples}`);
    if (!res.ok) throw new Error('Failed to fetch spatial clusters');
    return res.json();
  },

  async getKDERiskGrid(regionId = 'kerala_ernakulam', resolution = 25) {
    const res = await fetch(`${API_BASE}/spatial/kde-grid?region_id=${regionId}&resolution=${resolution}`);
    if (!res.ok) throw new Error('Failed to fetch KDE grid');
    return res.json();
  },

  async getRiverGeometry(regionId = 'kerala_ernakulam') {
    const res = await fetch(`${API_BASE}/spatial/river-geometry?region_id=${regionId}`);
    if (!res.ok) throw new Error('Failed to fetch river geometry');
    return res.json();
  },

  async getRoadNetwork(regionId = 'kerala_ernakulam') {
    const res = await fetch(`${API_BASE}/routing/road-network?region_id=${regionId}`);
    if (!res.ok) throw new Error('Failed to fetch road network');
    return res.json();
  },

  async getShelters(regionId = 'kerala_ernakulam') {
    const res = await fetch(`${API_BASE}/shelters?region_id=${regionId}`);
    if (!res.ok) throw new Error('Failed to fetch shelters');
    return res.json();
  },

  async calculateEvacuationRoute(regionId, startLat, startLng, shelterId = null) {
    const res = await fetch(`${API_BASE}/routing/evacuate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        region_id: regionId,
        start_lat: startLat,
        start_lng: startLng,
        shelter_id: shelterId,
        avoid_high_risk: true,
        risk_penalty_factor: 5.0
      })
    });
    if (!res.ok) throw new Error('Failed to compute evacuation routes');
    return res.json();
  },

  async triggerSimulation(regionId, scenario, intensity = 1.5) {
    const res = await fetch(`${API_BASE}/simulation/trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        region_id: regionId,
        scenario: scenario,
        intensity: intensity
      })
    });
    if (!res.ok) throw new Error('Failed to trigger simulation');
    return res.json();
  },

  async getSimulationStatus(regionId = 'kerala_ernakulam') {
    const res = await fetch(`${API_BASE}/simulation/status?region_id=${regionId}`);
    if (!res.ok) throw new Error('Failed to fetch simulation status');
    return res.json();
  }
};
