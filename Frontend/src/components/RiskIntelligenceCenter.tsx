import React from 'react';
import { AlertOctagon, EyeOff, ShieldCheck, ShieldAlert, AlertCircle } from 'lucide-react';
import { displayValue } from '../utils/helpers';

interface RiskAnalysis {
  risk_score?: number;
  risk_level?: string;
  risk_explanation?: string;
  risk_drivers?: string | string[];
  monitoring_actions?: string | string[];
  blind_spots?: string | string[];
}

interface RiskIntelligenceCenterProps {
  riskAnalysis: RiskAnalysis | null;
}

export const RiskIntelligenceCenter: React.FC<RiskIntelligenceCenterProps> = ({ riskAnalysis }) => {
  const data = riskAnalysis || {};

  const getRiskColor = (level?: string) => {
    const rawLevel = (level || '').toLowerCase();
    if (rawLevel === 'low' || rawLevel === 'safe' || rawLevel === 'green') return '#10b981';
    if (rawLevel === 'medium' || rawLevel === 'moderate' || rawLevel === 'amber') return '#f59e0b';
    if (rawLevel === 'high' || rawLevel === 'critical' || rawLevel === 'red') return '#ef4444';
    return '#64748b';
  };

  const getRiskBadge = (level?: string) => {
    const rawLevel = (level || '').toLowerCase().trim();
    if (rawLevel === 'low' || rawLevel === 'safe' || rawLevel === 'green') {
      return (
        <span className="badge badge-low">
          <ShieldCheck size={12} /> Low
        </span>
      );
    }
    if (rawLevel === 'medium' || rawLevel === 'moderate' || rawLevel === 'amber') {
      return (
        <span className="badge badge-medium">
          <AlertCircle size={12} /> Medium
        </span>
      );
    }
    if (rawLevel === 'high' || rawLevel === 'critical' || rawLevel === 'red') {
      return (
        <span className="badge badge-high">
          <ShieldAlert size={12} /> High
        </span>
      );
    }
    return <span className="badge" style={{ backgroundColor: '#475569', color: '#cbd5e1' }}>{level || '—'}</span>;
  };

  const renderListOrText = (value: any) => {
    if (!value) return <span className="text-muted">—</span>;
    if (Array.isArray(value)) {
      if (value.length === 0) return <span className="text-muted">—</span>;
      return (
        <ul className="risk-list">
          {value.map((item, idx) => (
            <li key={idx}>{displayValue(item)}</li>
          ))}
        </ul>
      );
    }
    return <div className="risk-text-para">{displayValue(value)}</div>;
  };

  return (
    <div className="card risk-intel-card">
      <div className="card-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertOctagon size={20} style={{ color: getRiskColor(data.risk_level) }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Risk Intelligence Center</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {getRiskBadge(data.risk_level)}
          {data.risk_score !== undefined && (
            <div className="risk-gauge-number">
              Score: <span style={{ color: getRiskColor(data.risk_level), fontWeight: 700 }}>{data.risk_score}</span>
            </div>
          )}
        </div>
      </div>

      <div className="risk-explanation-box">
        <h3 className="sub-header">Operational Summary</h3>
        <p className="summary-desc">{displayValue(data.risk_explanation)}</p>
      </div>

      <div className="risk-breakdown-grid">
        <div className="risk-grid-column">
          <div className="column-title">
            <AlertCircle size={14} style={{ color: '#f59e0b' }} />
            <h4>Risk Drivers</h4>
          </div>
          <div className="column-body">
            {renderListOrText(data.risk_drivers)}
          </div>
        </div>

        <div className="risk-grid-column">
          <div className="column-title">
            <ShieldCheck size={14} style={{ color: '#10b981' }} />
            <h4>Monitoring Actions</h4>
          </div>
          <div className="column-body">
            {renderListOrText(data.monitoring_actions)}
          </div>
        </div>

        <div className="risk-grid-column">
          <div className="column-title">
            <EyeOff size={14} style={{ color: '#ef4444' }} />
            <h4>Operational Blind Spots</h4>
          </div>
          <div className="column-body">
            {renderListOrText(data.blind_spots)}
          </div>
        </div>
      </div>

      <style>{`
        .risk-intel-card {
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
        .risk-gauge-number {
          background-color: hsla(var(--bg-surface-hover) / 0.8);
          border: 1px solid hsl(var(--border-color));
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          color: #94a3b8;
        }
        .risk-explanation-box {
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
        .risk-breakdown-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 768px) {
          .risk-breakdown-grid {
            grid-template-columns: 1fr;
          }
        }
        .risk-grid-column {
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
        .risk-list {
          padding-left: 16px;
          margin: 0;
          list-style-type: disc;
        }
        .risk-list li {
          font-size: 0.8rem;
          color: #94a3b8;
          line-height: 1.5;
          margin-bottom: 6px;
        }
        .risk-text-para {
          font-size: 0.8rem;
          color: #94a3b8;
          line-height: 1.5;
          white-space: pre-wrap;
        }
      `}</style>
    </div>
  );
};
