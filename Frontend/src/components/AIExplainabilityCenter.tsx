import React from 'react';
import { AlertTriangle, CheckSquare, TrendingUp, Target, Database, Brain } from 'lucide-react';
import { displayValue } from '../utils/helpers';

interface RiskAnalysis {
  risk_drivers?: string | string[];
  monitoring_actions?: string | string[];
}

interface RegimeAnalysis {
  evidence?: string | string[];
  recommended_focus?: string | string[];
}

interface AIExplainabilityCenterProps {
  riskAnalysis: RiskAnalysis | null;
  regimeAnalysis: RegimeAnalysis | null;
}

export const AIExplainabilityCenter: React.FC<AIExplainabilityCenterProps> = ({
  riskAnalysis,
  regimeAnalysis,
}) => {
  const risk = riskAnalysis || {};
  const regime = regimeAnalysis || {};

  // Utility to safely ensure value is a clean array of strings
  const ensureArray = (value: any): string[] => {
    if (value === undefined || value === null || value === '') return [];
    if (Array.isArray(value)) {
      return value
        .map((item) => displayValue(item))
        .filter((item) => item !== '—' && item.trim() !== '');
    }
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            return parsed
              .map((item) => displayValue(item))
              .filter((item) => item !== '—' && item.trim() !== '');
          }
        } catch {
          // ignore parsing error, treat as raw string
        }
      }
      return [displayValue(value)];
    }
    return [displayValue(value)];
  };

  const riskDrivers = ensureArray(risk.risk_drivers);
  const monitoringActions = ensureArray(risk.monitoring_actions);
  const regimeEvidence = ensureArray(regime.evidence);
  const recommendedFocus = ensureArray(regime.recommended_focus);

  const staticInputs = [
    'FII Net Flow',
    'DII Net Flow',
    'India VIX',
    'Put Call Ratio',
    'Market Breadth',
    'Sector Leadership',
  ];

  return (
    <div className="card explainability-card">
      <div className="card-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Brain size={20} style={{ color: 'hsl(var(--accent-teal))' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>AI Explainability Center</h2>
        </div>
      </div>

      <div className="explainability-purpose-box">
        <p className="purpose-desc">
          Explain why the AI assigned the current risk level and market regime.
        </p>
      </div>

      <div className="explainability-grid">
        {/* Card 1: Risk Drivers */}
        <div className="explain-sub-card">
          <div className="column-title">
            <AlertTriangle size={14} style={{ color: '#f59e0b' }} />
            <h4>Risk Drivers</h4>
          </div>
          <div className="column-body">
            {riskDrivers.length > 0 ? (
              <ul className="explain-bullet-list">
                {riskDrivers.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            ) : (
              <span className="text-muted">No risk drivers specified.</span>
            )}
          </div>
        </div>

        {/* Card 2: Monitoring Actions */}
        <div className="explain-sub-card">
          <div className="column-title">
            <CheckSquare size={14} style={{ color: '#10b981' }} />
            <h4>Monitoring Actions</h4>
          </div>
          <div className="column-body">
            {monitoringActions.length > 0 ? (
              <ul className="explain-checklist">
                {monitoringActions.map((item, idx) => (
                  <li key={idx} className="checklist-item">
                    <CheckSquare size={12} className="check-icon" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-muted">No monitoring actions specified.</span>
            )}
          </div>
        </div>

        {/* Card 3: Market Regime Evidence */}
        <div className="explain-sub-card">
          <div className="column-title">
            <TrendingUp size={14} style={{ color: '#06b6d4' }} />
            <h4>Market Regime Evidence</h4>
          </div>
          <div className="column-body">
            {regimeEvidence.length > 0 ? (
              <ul className="explain-bullet-list">
                {regimeEvidence.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            ) : (
              <span className="text-muted">No market regime evidence specified.</span>
            )}
          </div>
        </div>

        {/* Card 4: Recommended Focus */}
        <div className="explain-sub-card">
          <div className="column-title">
            <Target size={14} style={{ color: '#a855f7' }} />
            <h4>Recommended Focus</h4>
          </div>
          <div className="column-body">
            {recommendedFocus.length > 0 ? (
              <ul className="explain-bullet-list">
                {recommendedFocus.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            ) : (
              <span className="text-muted">No focus areas specified.</span>
            )}
          </div>
        </div>

        {/* Card 5: Data Inputs Used */}
        <div className="explain-sub-card compact-card" style={{ gridColumn: '1 / -1' }}>
          <div className="column-title" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <Database size={14} style={{ color: '#3b82f6' }} />
            <h4>Data Inputs Used</h4>
          </div>
          <div className="data-inputs-tags">
            {staticInputs.map((input, idx) => (
              <span key={idx} className="input-tag">
                {input}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .explainability-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .explainability-purpose-box {
          background-color: hsla(var(--bg-base) / 0.4);
          border: 1px solid hsla(var(--border-color) / 0.4);
          border-radius: 12px;
          padding: 12px 16px;
        }
        .purpose-desc {
          font-size: 0.8rem;
          line-height: 1.5;
          color: #94a3b8;
          font-style: italic;
        }
        .explainability-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (max-width: 640px) {
          .explainability-grid {
            grid-template-columns: 1fr;
          }
          .explainability-grid > .compact-card {
            grid-column: span 1 !important;
          }
        }
        .explain-sub-card {
          background-color: hsla(var(--bg-base) / 0.2);
          border: 1px solid hsla(var(--border-color) / 0.2);
          border-radius: 10px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: all var(--transition-fast);
        }
        .explain-sub-card:hover {
          border-color: hsla(var(--accent-teal) / 0.25);
          background-color: hsla(var(--bg-surface-hover) / 0.3);
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
        .explain-bullet-list {
          padding-left: 16px;
          margin: 0;
          list-style-type: disc;
        }
        .explain-bullet-list li {
          font-size: 0.8rem;
          color: #94a3b8;
          line-height: 1.5;
          margin-bottom: 6px;
        }
        .explain-checklist {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .checklist-item {
          display: flex;
          gap: 8px;
          align-items: flex-start;
          margin-bottom: 6px;
          font-size: 0.8rem;
          color: #94a3b8;
          line-height: 1.4;
        }
        .check-icon {
          color: #10b981;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .data-inputs-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }
        .input-tag {
          background-color: hsla(var(--bg-base) / 0.4);
          border: 1px solid hsla(var(--border-color) / 0.8);
          border-radius: 6px;
          padding: 3px 8px;
          font-size: 0.72rem;
          color: #cbd5e1;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};
