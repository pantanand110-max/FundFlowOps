import React from 'react';
import { Compass, CheckCircle, Lightbulb } from 'lucide-react';
import { displayValue, formatConfidence } from '../utils/helpers';

interface RegimeAnalysis {
  market_regime?: string;
  confidence?: number | string;
  regime_explanation?: string;
  evidence?: string | string[];
  recommended_focus?: string | string[];
}

interface MarketRegimeCenterProps {
  regimeAnalysis: RegimeAnalysis | null;
}

export const MarketRegimeCenter: React.FC<MarketRegimeCenterProps> = ({ regimeAnalysis }) => {
  const data = regimeAnalysis || {};

  const renderListOrText = (value: any) => {
    if (!value) return <span className="text-muted">—</span>;
    if (Array.isArray(value)) {
      if (value.length === 0) return <span className="text-muted">—</span>;
      return (
        <ul className="regime-list">
          {value.map((item, idx) => (
            <li key={idx}>{displayValue(item)}</li>
          ))}
        </ul>
      );
    }
    return <div className="regime-text-para">{displayValue(value)}</div>;
  };

  return (
    <div className="card regime-card">
      <div className="card-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={20} style={{ color: '#06b6d4' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Market Regime Center</h2>
        </div>
        {data.market_regime && (
          <div className="regime-badge-container">
            <span className="regime-tag">{displayValue(data.market_regime)}</span>
            {data.confidence !== undefined && (
              <span className="confidence-tag">
                {formatConfidence(data.confidence)} Conf.
              </span>
            )}
          </div>
        )}
      </div>

      <div className="regime-explanation-box">
        <h3 className="sub-header">Regime Analysis</h3>
        <p className="summary-desc">{displayValue(data.regime_explanation)}</p>
      </div>

      <div className="regime-grid">
        <div className="regime-column">
          <div className="column-title">
            <CheckCircle size={14} style={{ color: '#10b981' }} />
            <h4>Evidence</h4>
          </div>
          <div className="column-body">
            {renderListOrText(data.evidence)}
          </div>
        </div>

        <div className="regime-column">
          <div className="column-title">
            <Lightbulb size={14} style={{ color: '#f59e0b' }} />
            <h4>Recommended Focus</h4>
          </div>
          <div className="column-body">
            {renderListOrText(data.recommended_focus)}
          </div>
        </div>
      </div>

      <style>{`
        .regime-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .card-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid hsla(var(--border-color) / 0.5);
          padding-bottom: 12px;
        }
        .regime-badge-container {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .regime-tag {
          background-color: hsla(180, 100%, 25%, 0.1);
          color: #22d3ee;
          border: 1px solid rgba(34, 211, 238, 0.2);
          border-radius: 6px;
          padding: 3px 8px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        .confidence-tag {
          background-color: hsla(217, 91%, 60%, 0.1);
          color: #60a5fa;
          border: 1px solid rgba(96, 165, 250, 0.2);
          border-radius: 6px;
          padding: 3px 8px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .regime-explanation-box {
          background-color: hsla(var(--bg-base) / 0.4);
          border: 1px solid hsla(var(--border-color) / 0.4);
          border-radius: 12px;
          padding: 16px;
        }
        .sub-header {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: hsl(var(--accent-teal));
          margin-bottom: 6px;
        }
        .summary-desc {
          font-size: 0.875rem;
          line-height: 1.6;
          color: #cbd5e1;
        }
        .regime-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 768px) {
          .regime-grid {
            grid-template-columns: 1fr;
          }
        }
        .regime-column {
          background-color: hsla(var(--bg-base) / 0.2);
          border: 1px solid hsla(var(--border-color) / 0.2);
          border-radius: 10px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .column-title {
          display: flex;
          align-items: center;
          gap: 6px;
          border-bottom: 1px solid hsla(var(--border-color) / 0.4);
          padding-bottom: 6px;
        }
        .column-title h4 {
          font-size: 0.8rem;
          font-weight: 600;
          color: #e2e8f0;
        }
        .column-body {
          flex: 1;
        }
        .regime-list {
          padding-left: 16px;
          margin: 0;
          list-style-type: disc;
        }
        .regime-list li {
          font-size: 0.8rem;
          color: #94a3b8;
          line-height: 1.5;
          margin-bottom: 6px;
        }
        .regime-text-para {
          font-size: 0.8rem;
          color: #94a3b8;
          line-height: 1.5;
          white-space: pre-wrap;
        }
      `}</style>
    </div>
  );
};
