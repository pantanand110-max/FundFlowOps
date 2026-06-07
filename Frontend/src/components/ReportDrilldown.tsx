import React from 'react';
import { X, FileText, Layers } from 'lucide-react';
import { getJson, formatFiiDii, formatPercent, formatConfidence, displayValue, getParsedRiskAnalysis, getParsedRegimeAnalysis } from '../utils/helpers';

interface MarketReport {
  id: string;
  created_at: string;
  report_date?: string;
  report_type?: string;
  headline?: string;
  risk_level?: string;
  risk_score?: number;
  status?: string;
  source?: string;
  model_used?: string;
  kpi_json?: any;
  ai_report_json?: any;
  market_summary?: string;
  stakeholder_summary?: string;
}

interface Signal {
  id: string;
  signal_title?: string;
  severity?: string;
  signal_type?: string;
  explanation?: string;
  suggested_action?: string;
}

interface ReportDrilldownProps {
  isOpen: boolean;
  report: MarketReport | null;
  signals: Signal[];
  isLoadingSignals: boolean;
  onClose: () => void;
}

export const ReportDrilldown: React.FC<ReportDrilldownProps> = ({
  isOpen,
  report,
  signals,
  isLoadingSignals,
  onClose
}) => {
  if (!isOpen || !report) return null;

  const kpiJson = getJson(report.kpi_json);
  const aiJson = getJson(report.ai_report_json);
  const riskAnalysis = getParsedRiskAnalysis(report);
  const regimeAnalysis = getParsedRegimeAnalysis(report);

  const getRiskBadge = (level?: string) => {
    const rawLevel = (level || '').toLowerCase().trim();
    if (rawLevel === 'low' || rawLevel === 'safe' || rawLevel === 'green') {
      return <span className="badge badge-low">Low Risk</span>;
    }
    if (rawLevel === 'medium' || rawLevel === 'moderate' || rawLevel === 'amber') {
      return <span className="badge badge-medium">Medium Risk</span>;
    }
    if (rawLevel === 'high' || rawLevel === 'critical' || rawLevel === 'red') {
      return <span className="badge badge-high">High Risk</span>;
    }
    return <span className="badge" style={{ backgroundColor: '#475569', color: '#cbd5e1' }}>{level || '—'}</span>;
  };

  const getSeverityBadge = (severity?: string) => {
    const rawSeverity = (severity || '').toLowerCase().trim();
    if (rawSeverity === 'low' || rawSeverity === 'info') return <span className="badge badge-low" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>Low</span>;
    if (rawSeverity === 'medium' || rawSeverity === 'moderate' || rawSeverity === 'warning') return <span className="badge badge-medium" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>Medium</span>;
    if (rawSeverity === 'high' || rawSeverity === 'critical' || rawSeverity === 'danger') return <span className="badge badge-high" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>High</span>;
    return <span className="badge" style={{ backgroundColor: '#475569', color: '#cbd5e1', fontSize: '0.65rem', padding: '2px 6px' }}>{severity || '—'}</span>;
  };

  const renderContentItem = (value: any) => {
    if (!value) return <p className="section-para">—</p>;
    if (Array.isArray(value)) {
      if (value.length === 0) return <p className="section-para">—</p>;
      return (
        <ul className="section-list">
          {value.map((item, idx) => (
            <li key={idx}>{displayValue(item)}</li>
          ))}
        </ul>
      );
    }
    if (typeof value === 'object') {
      return <pre className="json-pre">{JSON.stringify(value, null, 2)}</pre>;
    }
    return <p className="section-para">{displayValue(value)}</p>;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content drilldown-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="text-teal" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>REPORT RUN ANALYSIS</span>
              {getRiskBadge(report.risk_level)}
            </div>
            <h2 className="drilldown-headline" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {displayValue(report.headline)}
            </h2>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Metadata Section */}
          <div className="meta-info-grid">
            <div>
              <span className="meta-label">Report Date:</span>
              <span className="meta-val">
                {report.report_date ? new Date(report.report_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
              </span>
            </div>
            <div>
              <span className="meta-label">Model Used:</span>
              <span className="meta-val">{displayValue(report.model_used)}</span>
            </div>
            <div>
              <span className="meta-label">Data Source:</span>
              <span className="meta-val">{displayValue(report.source)}</span>
            </div>
            <div>
              <span className="meta-label">Generated:</span>
              <span className="meta-val">
                {new Date(report.created_at).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* KPI Mini Grid */}
          <h3 className="drawer-section-heading">KPI Metrics</h3>
          <div className="drilldown-kpi-grid">
            <div className="kpi-mini-card">
              <span className="mini-label">Nifty 50 Change</span>
              <span className={`mini-val ${parseFloat(kpiJson.nifty_change_pct) >= 0 ? 'text-green-val' : 'text-red-val'}`}>
                {formatPercent(kpiJson.nifty_change_pct)}
              </span>
            </div>
            <div className="kpi-mini-card">
              <span className="mini-label">Bank Nifty Change</span>
              <span className={`mini-val ${parseFloat(kpiJson.banknifty_change_pct) >= 0 ? 'text-green-val' : 'text-red-val'}`}>
                {formatPercent(kpiJson.banknifty_change_pct)}
              </span>
            </div>
            <div className="kpi-mini-card">
              <span className="mini-label">FII Net Cash Flow</span>
              <span className={`mini-val ${parseFloat(kpiJson.fii_net_cr) >= 0 ? 'text-green-val' : 'text-red-val'}`}>
                {formatFiiDii(kpiJson.fii_net_cr)}
              </span>
            </div>
            <div className="kpi-mini-card">
              <span className="mini-label">DII Net Cash Flow</span>
              <span className={`mini-val ${parseFloat(kpiJson.dii_net_cr) >= 0 ? 'text-green-val' : 'text-red-val'}`}>
                {formatFiiDii(kpiJson.dii_net_cr)}
              </span>
            </div>
            <div className="kpi-mini-card">
              <span className="mini-label">India VIX</span>
              <span className="mini-val" style={{ color: '#60a5fa' }}>{displayValue(kpiJson.india_vix)}</span>
            </div>
            <div className="kpi-mini-card">
              <span className="mini-label">Risk Score</span>
              <span className="mini-val" style={{ color: '#f59e0b' }}>{displayValue(report.risk_score)}/100</span>
            </div>
          </div>

          {/* Summaries */}
          <div className="report-text-section">
            <div className="text-sub-box">
              <h4 className="box-title"><FileText size={14} className="text-teal" /> Market Summary</h4>
              <p className="box-content">{displayValue(report.market_summary)}</p>
            </div>
            <div className="text-sub-box">
              <h4 className="box-title"><Layers size={14} style={{ color: '#3b82f6' }} /> Stakeholder Summary</h4>
              <p className="box-content">{displayValue(report.stakeholder_summary)}</p>
            </div>
          </div>

          {/* Key Observations */}
          <h3 className="drawer-section-heading">Key Observations</h3>
          <div className="analysis-block-card">
            {renderContentItem(aiJson.key_observations)}
          </div>

          {/* Market Regime Analysis Section */}
          <h3 className="drawer-section-heading">Market Regime analysis</h3>
          <div className="analysis-block-card">
            {regimeAnalysis ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="regime-tag-mini">{displayValue(regimeAnalysis.market_regime)}</span>
                  <span className="confidence-tag-mini">Confidence: {formatConfidence(regimeAnalysis.confidence)}</span>
                </div>
                <p className="summary-desc" style={{ fontSize: '0.85rem' }}>{displayValue(regimeAnalysis.regime_explanation)}</p>
                <div>
                  <h5 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', marginBottom: '4px' }}>Regime Evidence</h5>
                  {renderContentItem(regimeAnalysis.evidence)}
                </div>
                <div>
                  <h5 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', marginBottom: '4px' }}>Recommended Focus</h5>
                  {renderContentItem(regimeAnalysis.recommended_focus)}
                </div>
              </div>
            ) : '—'}
          </div>

          {/* Flow, Breadth, Volatility, Sector Analyses */}
          <h3 className="drawer-section-heading">Flow & Liquidity Analysis</h3>
          <div className="analysis-block-card">
            {renderContentItem(aiJson.flow_analysis)}
          </div>

          <h3 className="drawer-section-heading">Market Breadth Analysis</h3>
          <div className="analysis-block-card">
            {renderContentItem(aiJson.breadth_analysis)}
          </div>

          <h3 className="drawer-section-heading">Volatility Structure</h3>
          <div className="analysis-block-card">
            {renderContentItem(aiJson.volatility_analysis)}
          </div>

          <h3 className="drawer-section-heading">Sector Performance & Rotation</h3>
          <div className="analysis-block-card">
            {renderContentItem(aiJson.sector_analysis)}
          </div>

          {/* Risk Analysis Section */}
          <h3 className="drawer-section-heading">Risk Intelligence Parameters</h3>
          <div className="analysis-block-card">
            {riskAnalysis ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p className="summary-desc" style={{ fontSize: '0.85rem' }}>{displayValue(riskAnalysis.risk_explanation)}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <h5 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', marginBottom: '4px' }}>Risk Drivers</h5>
                    {renderContentItem(riskAnalysis.risk_drivers)}
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', marginBottom: '4px' }}>Monitoring Actions</h5>
                    {renderContentItem(riskAnalysis.monitoring_actions)}
                  </div>
                </div>
                <div>
                  <h5 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', marginBottom: '4px' }}>Blind Spots</h5>
                  {renderContentItem(riskAnalysis.blind_spots)}
                </div>
              </div>
            ) : '—'}
          </div>

          {/* Selected Run Signals */}
          <h3 className="drawer-section-heading">Signals Generated during this Run</h3>
          <div className="drilldown-signals-section">
            {isLoadingSignals ? (
              <div style={{ padding: '16px', textAlign: 'center', color: '#64748b' }}>Loading associated signals...</div>
            ) : signals.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                No active signals generated during this operation run.
              </div>
            ) : (
              <div className="mini-signals-list">
                {signals.map((sig) => (
                  <div key={sig.id} className="mini-signal-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.85rem' }}>{displayValue(sig.signal_title)}</span>
                      {getSeverityBadge(sig.severity)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '6px' }}>
                      Type: {displayValue(sig.signal_type)}
                    </div>
                    <div className="mini-sig-desc">{displayValue(sig.explanation)}</div>
                    {sig.suggested_action && (
                      <div className="mini-sig-action">
                        <strong>Suggested Action:</strong> {displayValue(sig.suggested_action)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .drilldown-modal {
          max-width: 800px;
        }
        .btn-close {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          transition: background-color 0.2s, color 0.2s;
        }
        .btn-close:hover {
          background-color: hsl(var(--bg-surface-hover));
          color: #ffffff;
        }
        .drilldown-headline {
          color: #ffffff;
          line-height: 1.3;
          margin-top: 4px;
        }
        .meta-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 12px;
          background-color: hsla(var(--bg-base) / 0.5);
          border: 1px solid hsl(var(--border-color));
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 24px;
        }
        .meta-label {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          color: #64748b;
          font-weight: 500;
        }
        .meta-val {
          display: block;
          font-size: 0.8rem;
          color: #cbd5e1;
          font-weight: 600;
          margin-top: 2px;
        }
        .drawer-section-heading {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: hsl(var(--accent-teal));
          margin: 20px 0 8px 0;
          font-weight: 700;
          border-left: 3px solid hsl(var(--accent-teal));
          padding-left: 8px;
        }
        .drilldown-kpi-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 16px;
        }
        @media (max-width: 580px) {
          .drilldown-kpi-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .kpi-mini-card {
          background-color: hsla(var(--bg-surface-hover) / 0.4);
          border: 1px solid hsla(var(--border-color) / 0.5);
          border-radius: 8px;
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
        }
        .mini-label {
          font-size: 0.7rem;
          color: #94a3b8;
        }
        .mini-val {
          font-size: 1.1rem;
          font-weight: 700;
          margin-top: 2px;
          font-family: var(--font-display);
        }
        .text-green-val { color: #10b981; }
        .text-red-val { color: #ef4444; }

        .report-text-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }
        @media (max-width: 640px) {
          .report-text-section {
            grid-template-columns: 1fr;
          }
        }
        .text-sub-box {
          background-color: hsla(var(--bg-base) / 0.3);
          border: 1px solid hsla(var(--border-color) / 0.3);
          border-radius: 10px;
          padding: 12px;
        }
        .box-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: #cbd5e1;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .box-content {
          font-size: 0.8rem;
          color: #94a3b8;
          line-height: 1.5;
          white-space: pre-wrap;
        }
        .analysis-block-card {
          background-color: hsla(var(--bg-base) / 0.2);
          border: 1px solid hsla(var(--border-color) / 0.2);
          border-radius: 8px;
          padding: 14px;
          margin-bottom: 16px;
        }
        .section-para {
          font-size: 0.825rem;
          color: #94a3b8;
          line-height: 1.55;
          white-space: pre-wrap;
        }
        .section-list {
          padding-left: 18px;
          margin: 0;
          list-style-type: square;
        }
        .section-list li {
          font-size: 0.825rem;
          color: #94a3b8;
          line-height: 1.55;
          margin-bottom: 6px;
        }
        .json-pre {
          background-color: #030712;
          padding: 8px;
          border-radius: 6px;
          font-family: monospace;
          font-size: 0.75rem;
          color: #38bdf8;
          overflow-x: auto;
        }
        .regime-tag-mini {
          background-color: hsla(180, 100%, 25%, 0.1);
          color: #22d3ee;
          border: 1px solid rgba(34, 211, 238, 0.2);
          border-radius: 4px;
          padding: 2px 6px;
          font-size: 0.7rem;
          font-weight: 600;
        }
        .confidence-tag-mini {
          background-color: hsla(217, 91%, 60%, 0.1);
          color: #60a5fa;
          border: 1px solid rgba(96, 165, 250, 0.2);
          border-radius: 4px;
          padding: 2px 6px;
          font-size: 0.7rem;
          font-weight: 600;
        }
        .drilldown-signals-section {
          background-color: hsla(var(--bg-base) / 0.2);
          border: 1px solid hsla(var(--border-color) / 0.3);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 30px;
        }
        .mini-signals-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .mini-signal-item {
          background-color: hsla(var(--bg-base) / 0.4);
          border: 1px solid hsla(var(--border-color) / 0.5);
          border-radius: 6px;
          padding: 10px 12px;
        }
        .mini-sig-desc {
          font-size: 0.8rem;
          color: #94a3b8;
          line-height: 1.4;
        }
        .mini-sig-action {
          margin-top: 8px;
          font-size: 0.75rem;
          background-color: rgba(245, 158, 11, 0.05);
          border-left: 2px solid #f59e0b;
          padding: 4px 8px;
          color: #fbd38d;
        }
      `}</style>
    </div>
  );
};
