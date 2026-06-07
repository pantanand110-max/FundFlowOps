import React from 'react';
import { Zap, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { displayValue } from '../utils/helpers';

interface Signal {
  id: string;
  signal_title?: string;
  severity?: string;
  signal_type?: string;
  explanation?: string;
  suggested_action?: string;
}

interface SignalsTableProps {
  signals: Signal[];
}

export const SignalsTable: React.FC<SignalsTableProps> = ({ signals }) => {
  const getSeverityBadge = (severity?: string) => {
    const rawSeverity = (severity || '').toLowerCase().trim();
    if (rawSeverity === 'low' || rawSeverity === 'info') {
      return (
        <span className="badge badge-low" style={{ fontSize: '0.7rem' }}>
          Low
        </span>
      );
    }
    if (rawSeverity === 'medium' || rawSeverity === 'moderate' || rawSeverity === 'warning') {
      return (
        <span className="badge badge-medium" style={{ fontSize: '0.7rem' }}>
          Medium
        </span>
      );
    }
    if (rawSeverity === 'high' || rawSeverity === 'critical' || rawSeverity === 'danger') {
      return (
        <span className="badge badge-high" style={{ fontSize: '0.7rem' }}>
          High
        </span>
      );
    }
    return <span className="badge" style={{ backgroundColor: '#475569', color: '#cbd5e1', fontSize: '0.7rem' }}>{severity || '—'}</span>;
  };

  return (
    <div className="card signals-card">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Zap size={18} style={{ color: 'hsl(var(--accent-teal))' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Active Signal Center</h2>
        </div>
        <span className="badge-count">{signals.length} Active</span>
      </div>

      <div className="table-container">
        {signals.length === 0 ? (
          <div className="empty-signals">
            <ShieldAlert size={28} className="text-muted" />
            <p>No active signals detected for this operations period.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Signal / Type</th>
                <th style={{ width: '12%' }}>Severity</th>
                <th style={{ width: '38%' }}>Explanation</th>
                <th style={{ width: '25%' }}>Suggested Action</th>
              </tr>
            </thead>
            <tbody>
              {signals.map((sig) => (
                <tr key={sig.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#ffffff' }}>{displayValue(sig.signal_title)}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <ArrowUpRight size={10} /> {displayValue(sig.signal_type)}
                    </div>
                  </td>
                  <td>{getSeverityBadge(sig.severity)}</td>
                  <td className="explanation-cell">{displayValue(sig.explanation)}</td>
                  <td>
                    <div className="action-box">
                      {displayValue(sig.suggested_action)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        .signals-card {
          padding: 24px;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }
        .badge-count {
          background-color: hsla(var(--accent-teal) / 0.1);
          color: hsl(var(--accent-teal));
          border: 1px solid hsla(var(--accent-teal) / 0.2);
          border-radius: 4px;
          padding: 2px 8px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .empty-signals {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          gap: 12px;
          text-align: center;
          color: #64748b;
          font-size: 0.875rem;
        }
        .explanation-cell {
          font-size: 0.85rem;
          line-height: 1.5;
          color: #94a3b8;
          white-space: pre-wrap;
        }
        .action-box {
          font-size: 0.8rem;
          line-height: 1.4;
          background-color: hsla(217, 91%, 60%, 0.05);
          border: 1px dashed hsla(217, 91%, 60%, 0.2);
          border-radius: 6px;
          padding: 8px 10px;
          color: #93c5fd;
        }
      `}</style>
    </div>
  );
};
