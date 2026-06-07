import React from 'react';
import { Activity, AlertCircle, ArrowRight, ArrowUpRight, ArrowDownRight, CheckCircle2, PlusCircle, MinusCircle, Info } from 'lucide-react';
import { getJson, formatFiiDii, displayValue, getParsedRiskAnalysis, getParsedRegimeAnalysis } from '../utils/helpers';

interface MarketReport {
  id: string;
  created_at: string;
  risk_level?: string;
  risk_score?: number;
  kpi_json?: any;
  ai_report_json?: any;
}

interface Signal {
  id: string;
  report_id?: string;
  signal_title?: string;
  severity?: string;
  signal_type?: string;
  explanation?: string;
}

interface MarketChangeAnalysisProps {
  latestReport: MarketReport | null;
  previousReport: MarketReport | null;
  latestSignals: Signal[];
  previousSignals: Signal[];
}

interface MetricComparison {
  name: string;
  prevStr: string;
  currStr: string;
  diffStr: string;
  status: 'Improving' | 'Deteriorating' | 'Stable' | 'Neutral' | 'Watchful' | 'Changed';
  statusColor: 'green' | 'red' | 'amber';
}

export const MarketChangeAnalysis: React.FC<MarketChangeAnalysisProps> = ({
  latestReport,
  previousReport,
  latestSignals,
  previousSignals,
}) => {
  // If previousReport doesn't exist, show unavailable state
  if (!latestReport || !previousReport) {
    return (
      <div className="card change-analysis-card" style={{ marginTop: '24px' }}>
        <div className="card-header-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} style={{ color: 'hsl(var(--accent-teal))' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Market Change Analysis</h2>
          </div>
        </div>
        <div className="empty-comparison-box">
          <AlertCircle size={28} style={{ color: '#f59e0b', marginBottom: '10px' }} />
          <p className="empty-comparison-text">
            Previous report unavailable. Generate another report to enable comparison.
          </p>
        </div>
        <style>{`
          .empty-comparison-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 48px 24px;
            background-color: hsla(var(--bg-base) / 0.4);
            border: 1px dashed hsla(var(--border-color) / 0.8);
            border-radius: 12px;
            text-align: center;
          }
          .empty-comparison-text {
            font-size: 0.875rem;
            color: #94a3b8;
            max-width: 360px;
            line-height: 1.5;
          }
        `}</style>
      </div>
    );
  }

  // Parse JSON objects safely
  const latestKpis = getJson(latestReport.kpi_json);
  const previousKpis = getJson(previousReport.kpi_json);

  // Parse risk and regime analytics with robust cascading fallbacks
  const latestRiskParsed = getParsedRiskAnalysis(latestReport);
  const previousRiskParsed = getParsedRiskAnalysis(previousReport);
  const latestRegimeParsed = getParsedRegimeAnalysis(latestReport);
  const previousRegimeParsed = getParsedRegimeAnalysis(previousReport);

  const getRiskLevelScore = (level?: string): number => {
    const l = (level || '').toLowerCase().trim();
    if (l === 'low' || l === 'safe' || l === 'green') return 1;
    if (l === 'medium' || l === 'moderate' || l === 'amber') return 2;
    if (l === 'high' || l === 'critical' || l === 'red') return 3;
    return 0;
  };

  const getNum = (val: any): number | null => {
    if (val === undefined || val === null || val === '') return null;
    if (typeof val === 'number') return isNaN(val) ? null : val;
    // Clean string by removing whitespace or percentage symbols
    const str = String(val).replace(/%/g, '').trim();
    const n = Number(str);
    return isNaN(n) ? null : n;
  };

  const formatFlowDiff = (diff: number): string => {
    if (isNaN(diff)) return '—';
    const abs = Math.abs(diff).toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
    if (diff > 0) return `+₹${abs} Cr`;
    if (diff < 0) return `-₹${abs} Cr`;
    return `₹0.00 Cr`;
  };

  // Comparators
  const getRiskScoreComp = (): MetricComparison => {
    const prev = getNum(previousRiskParsed?.risk_score);
    const curr = getNum(latestRiskParsed?.risk_score);
    const prevStr = prev !== null ? String(prev) : '—';
    const currStr = curr !== null ? String(curr) : '—';

    if (prev === null || curr === null) {
      return { name: 'Risk Score', prevStr, currStr, diffStr: '—', status: 'Stable', statusColor: 'amber' };
    }

    const diff = curr - prev;
    const diffStr = diff > 0 ? `+${diff}` : diff < 0 ? `${diff}` : '0';
    const status = diff < 0 ? 'Improving' : diff > 0 ? 'Deteriorating' : 'Stable';
    const statusColor = diff < 0 ? 'green' : diff > 0 ? 'red' : 'amber';

    return { name: 'Risk Score', prevStr, currStr, diffStr, status, statusColor };
  };

  const getRiskLevelComp = (): MetricComparison => {
    const prevStr = displayValue(previousRiskParsed?.risk_level);
    const currStr = displayValue(latestRiskParsed?.risk_level);

    const prevScore = getRiskLevelScore(previousRiskParsed?.risk_level);
    const currScore = getRiskLevelScore(latestRiskParsed?.risk_level);

    if (prevScore === 0 || currScore === 0) {
      return { name: 'Risk Level', prevStr, currStr, diffStr: '—', status: 'Stable', statusColor: 'amber' };
    }

    const diffStr = prevStr === currStr ? 'No Change' : `${prevStr} → ${currStr}`;
    const status = currScore < prevScore ? 'Improving' : currScore > prevScore ? 'Deteriorating' : 'Stable';
    const statusColor = currScore < prevScore ? 'green' : currScore > prevScore ? 'red' : 'amber';

    return { name: 'Risk Level', prevStr, currStr, diffStr, status, statusColor };
  };

  const getRegimeComp = (): MetricComparison => {
    const prevStr = displayValue(previousRegimeParsed?.market_regime);
    const currStr = displayValue(latestRegimeParsed?.market_regime);

    if (prevStr === '—' || currStr === '—') {
      return { name: 'Market Regime', prevStr, currStr, diffStr: '—', status: 'Stable', statusColor: 'amber' };
    }

    const isDifferent = prevStr.toLowerCase().trim() !== currStr.toLowerCase().trim();
    return {
      name: 'Market Regime',
      prevStr,
      currStr,
      diffStr: isDifferent ? 'Regime Changed' : 'No Change',
      status: isDifferent ? 'Changed' : 'Stable',
      statusColor: 'amber',
    };
  };

  const getFiiComp = (): MetricComparison => {
    const prev = getNum(previousKpis.fii_net_cr);
    const curr = getNum(latestKpis.fii_net_cr);
    const prevStr = prev !== null ? formatFiiDii(prev) : '—';
    const currStr = curr !== null ? formatFiiDii(curr) : '—';

    if (prev === null || curr === null) {
      return { name: 'FII Net Flow', prevStr, currStr, diffStr: '—', status: 'Stable', statusColor: 'amber' };
    }

    const diff = curr - prev;
    const diffStr = formatFlowDiff(diff);
    const status = diff > 0 ? 'Improving' : diff < 0 ? 'Deteriorating' : 'Stable';
    const statusColor = diff > 0 ? 'green' : diff < 0 ? 'red' : 'amber';

    return { name: 'FII Net Flow', prevStr, currStr, diffStr, status, statusColor };
  };

  const getDiiComp = (): MetricComparison => {
    const prev = getNum(previousKpis.dii_net_cr);
    const curr = getNum(latestKpis.dii_net_cr);
    const prevStr = prev !== null ? formatFiiDii(prev) : '—';
    const currStr = curr !== null ? formatFiiDii(curr) : '—';

    if (prev === null || curr === null) {
      return { name: 'DII Net Flow', prevStr, currStr, diffStr: '—', status: 'Stable', statusColor: 'amber' };
    }

    const diff = curr - prev;
    const diffStr = formatFlowDiff(diff);
    const status = diff > 0 ? 'Improving' : diff < 0 ? 'Deteriorating' : 'Stable';
    const statusColor = diff > 0 ? 'green' : diff < 0 ? 'red' : 'amber';

    return { name: 'DII Net Flow', prevStr, currStr, diffStr, status, statusColor };
  };

  const getVixComp = (): MetricComparison => {
    const prev = getNum(previousKpis.india_vix);
    const curr = getNum(latestKpis.india_vix);
    const prevStr = prev !== null ? prev.toFixed(2) : '—';
    const currStr = curr !== null ? curr.toFixed(2) : '—';

    if (prev === null || curr === null) {
      return { name: 'India VIX', prevStr, currStr, diffStr: '—', status: 'Stable', statusColor: 'amber' };
    }

    const diff = curr - prev;
    const diffStr = diff > 0 ? `+${diff.toFixed(2)}` : `${diff.toFixed(2)}`;
    const status = diff < 0 ? 'Improving' : diff > 0 ? 'Deteriorating' : 'Stable';
    const statusColor = diff < 0 ? 'green' : diff > 0 ? 'red' : 'amber';

    return { name: 'India VIX', prevStr, currStr, diffStr, status, statusColor };
  };

  const getBreadthComp = (): MetricComparison => {
    const prev = getNum(previousKpis.market_breadth_ratio);
    const curr = getNum(latestKpis.market_breadth_ratio);
    const prevStr = prev !== null ? prev.toFixed(2) : '—';
    const currStr = curr !== null ? curr.toFixed(2) : '—';

    if (prev === null || curr === null) {
      return { name: 'Market Breadth', prevStr, currStr, diffStr: '—', status: 'Stable', statusColor: 'amber' };
    }

    const diff = curr - prev;
    const diffStr = diff > 0 ? `+${diff.toFixed(2)}` : `${diff.toFixed(2)}`;
    const status = diff > 0 ? 'Improving' : diff < 0 ? 'Deteriorating' : 'Stable';
    const statusColor = diff > 0 ? 'green' : diff < 0 ? 'red' : 'amber';

    return { name: 'Market Breadth', prevStr, currStr, diffStr, status, statusColor };
  };

  const getPcrComp = (): MetricComparison => {
    const prev = getNum(previousKpis.put_call_ratio);
    const curr = getNum(latestKpis.put_call_ratio);
    const prevStr = prev !== null ? prev.toFixed(2) : '—';
    const currStr = curr !== null ? curr.toFixed(2) : '—';

    if (prev === null || curr === null) {
      return { name: 'Put Call Ratio', prevStr, currStr, diffStr: '—', status: 'Stable', statusColor: 'amber' };
    }

    const diff = curr - prev;
    const diffStr = diff > 0 ? `+${diff.toFixed(2)}` : `${diff.toFixed(2)}`;
    const isNeutral = curr >= 0.9 && curr <= 1.2;
    const status = isNeutral ? 'Neutral' : 'Watchful';
    const statusColor = isNeutral ? 'green' : 'amber';

    return { name: 'Put Call Ratio', prevStr, currStr, diffStr, status, statusColor };
  };

  const comparisons: MetricComparison[] = [
    getRiskScoreComp(),
    getRiskLevelComp(),
    getRegimeComp(),
    getFiiComp(),
    getDiiComp(),
    getVixComp(),
    getBreadthComp(),
    getPcrComp(),
  ];

  // Compare signals
  const compareSignals = () => {
    const newSignals: Signal[] = [];
    const removedSignals: Signal[] = [];
    const severityChanges: Array<{
      title: string;
      prevSeverity: string;
      currSeverity: string;
      explanation?: string;
    }> = [];

    const latestMap = new Map<string, Signal>();
    latestSignals.forEach((sig) => {
      if (sig.signal_title) {
        latestMap.set(sig.signal_title.toLowerCase().trim(), sig);
      }
    });

    const previousMap = new Map<string, Signal>();
    previousSignals.forEach((sig) => {
      if (sig.signal_title) {
        previousMap.set(sig.signal_title.toLowerCase().trim(), sig);
      }
    });

    latestSignals.forEach((sig) => {
      if (!sig.signal_title) return;
      const key = sig.signal_title.toLowerCase().trim();
      const prevSig = previousMap.get(key);
      if (!prevSig) {
        newSignals.push(sig);
      } else {
        const currSev = (sig.severity || '').toLowerCase().trim();
        const prevSev = (prevSig.severity || '').toLowerCase().trim();
        if (currSev !== prevSev) {
          severityChanges.push({
            title: sig.signal_title,
            prevSeverity: prevSig.severity || '—',
            currSeverity: sig.severity || '—',
            explanation: sig.explanation,
          });
        }
      }
    });

    previousSignals.forEach((sig) => {
      if (!sig.signal_title) return;
      const key = sig.signal_title.toLowerCase().trim();
      if (!latestMap.has(key)) {
        removedSignals.push(sig);
      }
    });

    return { newSignals, removedSignals, severityChanges };
  };

  const { newSignals, removedSignals, severityChanges } = compareSignals();
  const hasSignalChanges =
    newSignals.length > 0 || removedSignals.length > 0 || severityChanges.length > 0;

  const getSeverityColor = (sev?: string) => {
    const s = (sev || '').toLowerCase().trim();
    if (s === 'high' || s === 'critical') return '#ef4444';
    if (s === 'medium' || s === 'moderate') return '#f59e0b';
    if (s === 'low' || s === 'safe') return '#10b981';
    return '#94a3b8';
  };

  return (
    <div className="card change-analysis-card" style={{ marginTop: '24px' }}>
      <div className="card-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={20} style={{ color: 'hsl(var(--accent-teal))' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Market Change Analysis</h2>
        </div>
        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
          Comparing current intelligence report run with the previous one
        </div>
      </div>

      <div className="change-analysis-grid">
        {comparisons.map((comp, idx) => (
          <div key={idx} className="comp-card">
            <div className="comp-header">{comp.name}</div>
            
            <div className="comp-body">
              <div className="comp-val-box">
                <span className="comp-label">PREVIOUS</span>
                <span className="comp-val">{comp.prevStr}</span>
              </div>
              <ArrowRight size={14} className="comp-arrow-divider" />
              <div className="comp-val-box">
                <span className="comp-label">CURRENT</span>
                <span className="comp-val">{comp.currStr}</span>
              </div>
            </div>

            <div className="comp-footer">
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {comp.diffStr.startsWith('+') && <ArrowUpRight size={12} style={{ color: comp.statusColor === 'green' ? '#10b981' : '#ef4444' }} />}
                {comp.diffStr.startsWith('-') && <ArrowDownRight size={12} style={{ color: comp.statusColor === 'green' ? '#10b981' : '#ef4444' }} />}
                <span className="comp-diff" style={{ color: comp.statusColor === 'green' ? '#10b981' : comp.statusColor === 'red' ? '#ef4444' : '#cbd5e1' }}>
                  {comp.diffStr}
                </span>
              </div>
              <span className={`comp-status-badge status-${comp.statusColor}`}>
                {comp.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="signal-comparison-section">
        <h3 className="sub-header" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', marginBottom: '12px' }}>
          <Info size={14} style={{ color: 'hsl(var(--accent-teal))' }} />
          Operational Signal Changes
        </h3>

        {hasSignalChanges ? (
          <div className="signal-comp-grid">
            {/* New Signals */}
            {newSignals.length > 0 && (
              <div className="signal-comp-col">
                <div className="signal-comp-col-title">
                  <PlusCircle size={14} style={{ color: '#10b981' }} />
                  <h4>New Signals Added ({newSignals.length})</h4>
                </div>
                <div className="signal-change-list">
                  {newSignals.map((sig, idx) => (
                    <div key={idx} className="signal-change-item border-green">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                        <span className="signal-title">{sig.signal_title}</span>
                        <span className="mini-sev-badge" style={{ backgroundColor: getSeverityColor(sig.severity) + '20', color: getSeverityColor(sig.severity), border: `1px solid ${getSeverityColor(sig.severity)}40` }}>
                          {sig.severity}
                        </span>
                      </div>
                      {sig.explanation && <p className="signal-expl">{sig.explanation}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Severity Changes */}
            {severityChanges.length > 0 && (
              <div className="signal-comp-col">
                <div className="signal-comp-col-title">
                  <Activity size={14} style={{ color: '#f59e0b' }} />
                  <h4>Severity Changes ({severityChanges.length})</h4>
                </div>
                <div className="signal-change-list">
                  {severityChanges.map((ch, idx) => (
                    <div key={idx} className="signal-change-item border-amber">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                        <span className="signal-title">{ch.title}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem' }}>
                          <span style={{ color: getSeverityColor(ch.prevSeverity), fontWeight: 700 }}>{ch.prevSeverity}</span>
                          <span style={{ color: '#64748b' }}>→</span>
                          <span style={{ color: getSeverityColor(ch.currSeverity), fontWeight: 700 }}>{ch.currSeverity}</span>
                        </div>
                      </div>
                      {ch.explanation && <p className="signal-expl">{ch.explanation}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Removed Signals */}
            {removedSignals.length > 0 && (
              <div className="signal-comp-col" style={{ gridColumn: newSignals.length === 0 || severityChanges.length === 0 ? 'span 1' : 'span 2' }}>
                <div className="signal-comp-col-title">
                  <MinusCircle size={14} style={{ color: '#ef4444' }} />
                  <h4>Signals Resolved/Removed ({removedSignals.length})</h4>
                </div>
                <div className="signal-change-list">
                  {removedSignals.map((sig, idx) => (
                    <div key={idx} className="signal-change-item border-red">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                        <span className="signal-title" style={{ color: '#94a3b8', textDecoration: 'line-through' }}>{sig.signal_title}</span>
                        <span className="mini-sev-badge" style={{ backgroundColor: '#47556920', color: '#94a3b8', border: '1px solid #47556940' }}>
                          Was {sig.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="no-signal-changes">
            <CheckCircle2 size={16} style={{ color: '#10b981', marginRight: '6px' }} />
            No signal changes detected between reports.
          </div>
        )}
      </div>

      <style>{`
        .change-analysis-card {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .change-analysis-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        @media (max-width: 1024px) {
          .change-analysis-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 640px) {
          .change-analysis-grid {
            grid-template-columns: 1fr;
          }
        }
        .comp-card {
          background-color: hsla(var(--bg-base) / 0.2);
          border: 1px solid hsla(var(--border-color) / 0.2);
          border-radius: 12px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 12px;
          transition: all var(--transition-fast);
        }
        .comp-card:hover {
          border-color: hsla(var(--accent-teal) / 0.25);
          background-color: hsla(var(--bg-surface-hover) / 0.3);
        }
        .comp-header {
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94a3b8;
        }
        .comp-body {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin: 2px 0;
        }
        .comp-val-box {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .comp-label {
          font-size: 0.6rem;
          color: #64748b;
          font-weight: 700;
        }
        .comp-val {
          font-size: 0.85rem;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .comp-arrow-divider {
          color: #475569;
          flex-shrink: 0;
        }
        .comp-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid hsla(var(--border-color) / 0.4);
          padding-top: 8px;
        }
        .comp-diff {
          font-size: 0.78rem;
          font-weight: 700;
        }
        .comp-status-badge {
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          padding: 2px 6px;
          border-radius: 4px;
          letter-spacing: 0.02em;
        }
        .status-green {
          background-color: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .status-red {
          background-color: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .status-amber {
          background-color: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.2);
        }
        .signal-comparison-section {
          border-top: 1px solid hsla(var(--border-color) / 0.5);
          padding-top: 16px;
        }
        .signal-comp-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 8px;
        }
        @media (max-width: 768px) {
          .signal-comp-grid {
            grid-template-columns: 1fr;
          }
        }
        .signal-comp-col {
          background-color: hsla(var(--bg-base) / 0.15);
          border: 1px solid hsla(var(--border-color) / 0.2);
          border-radius: 12px;
          padding: 16px;
        }
        .signal-comp-col-title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          border-bottom: 1px solid hsla(var(--border-color) / 0.4);
          padding-bottom: 6px;
        }
        .signal-comp-col-title h4 {
          font-size: 0.8rem;
          font-weight: 700;
          color: #e2e8f0;
        }
        .signal-change-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .signal-change-item {
          background-color: hsla(var(--bg-surface) / 0.3);
          border: 1px solid hsla(var(--border-color) / 0.2);
          border-radius: 8px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .border-green {
          border-left: 3px solid #10b981;
        }
        .border-amber {
          border-left: 3px solid #f59e0b;
        }
        .border-red {
          border-left: 3px solid #ef4444;
        }
        .signal-title {
          font-size: 0.78rem;
          font-weight: 600;
          color: #cbd5e1;
        }
        .mini-sev-badge {
          font-size: 0.6rem;
          font-weight: 700;
          text-transform: uppercase;
          padding: 1px 5px;
          border-radius: 4px;
        }
        .signal-expl {
          font-size: 0.72rem;
          color: #94a3b8;
          line-height: 1.4;
          margin-top: 2px;
        }
        .no-signal-changes {
          display: flex;
          align-items: center;
          background-color: hsla(var(--bg-base) / 0.4);
          border: 1px solid hsla(var(--border-color) / 0.6);
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 0.78rem;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
};
