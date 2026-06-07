import React from 'react';
import { AlertCircle, ShieldCheck, ShieldAlert, Award, FileText } from 'lucide-react';
import { displayValue } from '../utils/helpers';

interface LatestReportProps {
  report: {
    headline?: string;
    market_summary?: string;
    stakeholder_summary?: string;
    risk_level?: string;
    risk_score?: number;
    report_date?: string;
    model_used?: string;
  } | null;
  onCopySummary?: () => void;
  isPresentationMode?: boolean;
}

export const LatestReport: React.FC<LatestReportProps> = ({ report, onCopySummary, isPresentationMode }) => {
  if (!report) {
    return (
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
        <p className="text-muted">No report loaded</p>
      </div>
    );
  }

  const getRiskBadge = (level?: string) => {
    const rawLevel = (level || '').toLowerCase().trim();
    if (rawLevel === 'low' || rawLevel === 'safe' || rawLevel === 'green') {
      return (
        <span className="badge badge-low">
          <ShieldCheck size={12} /> Low Risk
        </span>
      );
    }
    if (rawLevel === 'medium' || rawLevel === 'moderate' || rawLevel === 'amber') {
      return (
        <span className="badge badge-medium">
          <AlertCircle size={12} /> Medium Risk
        </span>
      );
    }
    if (rawLevel === 'high' || rawLevel === 'critical' || rawLevel === 'red') {
      return (
        <span className="badge badge-high">
          <ShieldAlert size={12} /> High Risk
        </span>
      );
    }
    return <span className="badge" style={{ backgroundColor: '#475569', color: '#cbd5e1' }}>{level || '—'}</span>;
  };

  return (
    <div className="card latest-report-card">
      <div className="report-header">
        <div className="header-meta">
          <span className="section-label">LATEST AI MARKET REPORT</span>
          {report.report_date && (
            <span className="report-date-text">
              {new Date(report.report_date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          )}
        </div>
        <div className="risk-score-indicator" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {onCopySummary && (
            <button className="btn-secondary copy-summary-btn" onClick={onCopySummary}>
              📋 Copy Executive Summary
            </button>
          )}
          {getRiskBadge(report.risk_level)}
          {report.risk_score !== undefined && (
            <div className="score-badge">
              <span className="score-val">{displayValue(report.risk_score)}</span>
              <span className="score-max">/100</span>
            </div>
          )}
        </div>
      </div>

      <h2 className="report-headline">{displayValue(report.headline)}</h2>

      <div className="summaries-grid">
        <div className="summary-section">
          <div className="section-title">
            <FileText size={16} className="text-teal" />
            <h3>Market Summary</h3>
          </div>
          <div className="summary-content">
            {displayValue(report.market_summary)}
          </div>
        </div>

        <div className="summary-section">
          <div className="section-title">
            <Award size={16} style={{ color: '#3b82f6' }} />
            <h3>Stakeholder Summary</h3>
          </div>
          <div className="summary-content">
            {displayValue(report.stakeholder_summary)}
          </div>
        </div>
      </div>

      {report.model_used && !isPresentationMode && (
        <div className="report-footer">
          <span className="text-muted">Powered by {report.model_used}</span>
        </div>
      )}

      <style>{`
        .latest-report-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 12px;
          border-bottom: 1px solid hsla(var(--border-color) / 0.5);
          padding-bottom: 12px;
        }
        .header-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .section-label {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: hsl(var(--accent-teal));
        }
        .report-date-text {
          font-size: 0.8rem;
          color: #94a3b8;
        }
        .risk-score-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .score-badge {
          background-color: hsla(var(--bg-surface-hover) / 0.8);
          border: 1px solid hsl(var(--border-color));
          border-radius: 6px;
          padding: 3px 8px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #ffffff;
        }
        .score-max {
          color: #64748b;
          font-size: 0.65rem;
        }
        .report-headline {
          font-size: 1.5rem;
          line-height: 1.35;
          margin-bottom: 8px;
          font-weight: 700;
          color: #ffffff;
        }
        .summaries-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 768px) {
          .summaries-grid {
            grid-template-columns: 1fr;
          }
        }
        .summary-section {
          background-color: hsla(var(--bg-base) / 0.3);
          border: 1px solid hsla(var(--border-color) / 0.3);
          border-radius: 12px;
          padding: 16px;
        }
        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .section-title h3 {
          font-size: 0.9rem;
          font-weight: 600;
          color: #cbd5e1;
        }
        .summary-content {
          font-size: 0.875rem;
          color: #94a3b8;
          line-height: 1.6;
          white-space: pre-wrap;
        }
        .report-footer {
          margin-top: 8px;
          border-top: 1px solid hsla(var(--border-color) / 0.3);
          padding-top: 8px;
          text-align: right;
          font-size: 0.7rem;
        }
        .copy-summary-btn {
          padding: 6px 12px;
          font-size: 0.75rem;
          border-radius: 6px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};
