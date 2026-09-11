import React from 'react';
import { Network, Target, Filter, Layers, CheckCircle2 } from 'lucide-react';

export default function SpatialClusterPanel({ 
  clustersData, 
  epsKm, 
  setEpsKm, 
  minSamples, 
  setMinSamples,
  onRecalculate,
  loading
}) {
  if (!clustersData) {
    return (
      <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
        <p style={{ color: '#94a3b8' }}>Loading spatial clustering algorithms...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Network size={18} color="#38bdf8" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Spatial Hazard Clustering</h3>
        </div>
        <span className="badge-status safe" style={{ fontSize: '0.68rem' }}>
          DBSCAN + Moran's I
        </span>
      </div>

      {/* Moran's I Spatial Autocorrelation Card */}
      <div className="glass-panel" style={{ padding: '14px' }}>
        <span className="metric-label">Global Moran's I Autocorrelation</span>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '4px' }}>
          <span className="metric-value" style={{ color: '#38bdf8' }}>
            I = {clustersData.spatial_autocorrelation_morans_i}
          </span>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            p-value: <strong>{clustersData.p_value}</strong>
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '6px' }}>
          Pattern: <strong style={{ color: '#34d399' }}>{clustersData.spatial_pattern}</strong>
        </p>
      </div>

      {/* DBSCAN Hyperparameter Controls */}
      <div className="glass-panel" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Target size={14} color="#38bdf8" />
          DBSCAN Tuning Hyperparameters
        </span>

        {/* Epsilon Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
            <span style={{ color: '#cbd5e1' }}>Spatial Epsilon (&epsilon;):</span>
            <strong style={{ color: '#38bdf8' }}>{epsKm} km</strong>
          </div>
          <input
            type="range"
            min="0.8"
            max="3.5"
            step="0.1"
            value={epsKm}
            onChange={(e) => setEpsKm(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#0284c7' }}
          />
        </div>

        {/* MinPts Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
            <span style={{ color: '#cbd5e1' }}>Min Points (MinPts):</span>
            <strong style={{ color: '#38bdf8' }}>{minSamples} pts</strong>
          </div>
          <input
            type="range"
            min="2"
            max="5"
            step="1"
            value={minSamples}
            onChange={(e) => setMinSamples(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: '#0284c7' }}
          />
        </div>

        <button 
          className="btn-primary" 
          onClick={onRecalculate}
          disabled={loading}
          style={{ justifyContent: 'center', marginTop: '4px' }}
        >
          <Filter size={14} />
          Re-Cluster Hazard Network
        </button>
      </div>

      {/* Cluster Summary Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div className="metric-card">
          <span className="metric-label">Identified Clusters</span>
          <span className="metric-value" style={{ color: '#f87171' }}>
            {clustersData.num_clusters} Zones
          </span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Filtered Noise Pts</span>
          <span className="metric-value" style={{ color: '#94a3b8' }}>
            {clustersData.noise_points_count} Outliers
          </span>
        </div>
      </div>

      {/* Cluster Details List */}
      <div>
        <span className="metric-label" style={{ display: 'block', marginBottom: '8px' }}>
          Active Spatial Hazard Clusters
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
          {clustersData.clusters.map((c) => (
            <div 
              key={c.cluster_id} 
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                padding: '10px 12px',
                borderLeft: `3px solid ${c.hazard_level === 'CRITICAL' ? '#ef4444' : '#f59e0b'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.82rem', color: '#f8fafc' }}>
                  Cluster #{c.cluster_id + 1}
                </strong>
                <span className={`badge-status ${c.hazard_level === 'CRITICAL' ? 'severe' : 'high'}`}>
                  {c.hazard_level}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#94a3b8', marginTop: '6px' }}>
                <span>Radius: {c.radius_km} km</span>
                <span>Depth: <strong style={{ color: '#e2e8f0' }}>{c.avg_water_depth_cm} cm</strong></span>
                <span>Sensors: {c.points_count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
