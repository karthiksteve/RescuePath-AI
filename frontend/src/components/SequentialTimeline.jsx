import React, { useState } from 'react';
import { Clock, TrendingUp, AlertTriangle, Droplets, Activity } from 'lucide-react';

export default function SequentialTimeline({ sequentialData }) {
  const [activeHorizon, setActiveHorizon] = useState(24);

  if (!sequentialData) {
    return (
      <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
        <p style={{ color: '#94a3b8' }}>Loading sequential predictive models...</p>
      </div>
    );
  }

  const forecast = activeHorizon === 24 
    ? sequentialData.forecast_24h 
    : activeHorizon === 48 
      ? sequentialData.forecast_48h 
      : sequentialData.forecast_72h;

  const probPercent = Math.round(forecast.flood_probability * 100);
  const isSevere = forecast.risk_level === 'SEVERE';
  const isHigh = forecast.risk_level === 'HIGH';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Title & Horizon Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={18} color="#38bdf8" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Sequential Multi-Step Forecast</h3>
        </div>
        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
          Confidence: {(sequentialData.confidence_score * 100).toFixed(1)}%
        </span>
      </div>

      {/* Horizon Tabs: 24h, 48h, 72h */}
      <div style={{ display: 'flex', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '4px', borderRadius: '8px' }}>
        {[24, 48, 72].map((h) => (
          <button
            key={h}
            onClick={() => setActiveHorizon(h)}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeHorizon === h ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'transparent',
              color: activeHorizon === h ? '#ffffff' : '#94a3b8',
              transition: 'all 0.2s'
            }}
          >
            +{h} Hours
          </button>
        ))}
      </div>

      {/* Main Metric Spotlight Card */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '16px', 
          borderLeft: `4px solid ${isSevere ? '#ef4444' : isHigh ? '#f59e0b' : '#10b981'}` 
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span className="metric-label">Predicted Flood Probability (+{activeHorizon}h)</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
              <span 
                className="metric-value" 
                style={{ 
                  fontSize: '2rem',
                  color: isSevere ? '#f87171' : isHigh ? '#fbbf24' : '#34d399' 
                }}
              >
                {probPercent}%
              </span>
              <span className={`badge-status ${isSevere ? 'severe' : isHigh ? 'high' : 'safe'}`}>
                {forecast.risk_level} RISK
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className="metric-label">Expected Gauge</span>
            <div className="metric-value" style={{ fontSize: '1.25rem', marginTop: '4px' }}>
              {forecast.expected_river_level_m} m
            </div>
            <span style={{ fontSize: '0.7rem', color: forecast.expected_river_level_m >= 7.5 ? '#f87171' : '#94a3b8' }}>
              Danger Mark: 7.50 m
            </span>
          </div>
        </div>

        {/* Probability Progress Bar */}
        <div style={{ marginTop: '14px', background: 'rgba(255,255,255,0.08)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
          <div 
            style={{ 
              width: `${probPercent}%`, 
              height: '100%', 
              background: isSevere ? '#ef4444' : isHigh ? '#f59e0b' : '#10b981',
              borderRadius: '4px',
              transition: 'width 0.4s ease'
            }}
          />
        </div>
      </div>

      {/* Sequence Trend Alert */}
      <div 
        style={{ 
          background: 'rgba(30, 41, 59, 0.4)', 
          border: '1px solid rgba(255,255,255,0.06)', 
          padding: '10px 14px', 
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <TrendingUp size={16} color="#38bdf8" />
        <span style={{ fontSize: '0.78rem', color: '#e2e8f0' }}>
          {sequentialData.sequence_trend}
        </span>
      </div>

      {/* Driving Factors */}
      <div>
        <span className="metric-label" style={{ display: 'block', marginBottom: '8px' }}>
          Key Hydro-Meteorological Drivers
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {forecast.driving_factors.map((factor, idx) => (
            <div 
              key={idx} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                fontSize: '0.75rem',
                color: '#cbd5e1',
                background: 'rgba(15, 23, 42, 0.5)',
                padding: '6px 10px',
                borderRadius: '6px'
              }}
            >
              <Droplets size={12} color="#38bdf8" />
              <span>{factor}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Sequence Bar Chart (Past 72 hours) */}
      <div>
        <span className="metric-label" style={{ display: 'block', marginBottom: '8px' }}>
          72-Hour Sequential Rainfall Input Sequence (mm)
        </span>
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'flex-end', 
            gap: '4px', 
            height: '60px',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '8px 10px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}
        >
          {sequentialData.historical_sequence.map((step, idx) => {
            const h = Math.min(100, Math.max(8, (step.rainfall_mm / 130.0) * 100));
            return (
              <div 
                key={idx} 
                title={`T${step.hour_step}h: ${step.rainfall_mm}mm rain, ${step.discharge_cumecs} cumecs`}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background: step.rainfall_mm > 80 ? '#ef4444' : step.rainfall_mm > 40 ? '#f59e0b' : '#38bdf8',
                  borderRadius: '2px',
                  transition: 'height 0.3s'
                }}
              />
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b', marginTop: '4px' }}>
          <span>T - 72h</span>
          <span>T - 36h</span>
          <span>T 0 (Now)</span>
        </div>
      </div>
    </div>
  );
}
