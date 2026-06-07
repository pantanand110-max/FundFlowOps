import React from 'react';
import { History, Eye } from 'lucide-react';
import { displayValue } from '../utils/helpers';

interface MarketReport {
  id: string;
  created_at: string;
  report_date?: string;
  report_type?: string;
  headline?: string;
  risk_level?: string;
  risk_score?: number;
  status?: string;
}

interface ReportArchiveProps {
  reports: MarketReport[];
  onViewDetails: (report: MarketReport) => void;
}

export const ReportArchive: React.FC<ReportArchiveProps> = ({ reports, onViewDetails }) => {
  const getRiskBadge = (level?: string) => {
    const rawLevel = (level || '').toLowerCase().trim();
    if (rawLevel === 'low' || rawLevel === 'safe' || rawLevel === 'green') {
      return (
        <span className="badge badge-low" style={{ fontSize: '0.7rem' }}>
          Low
        </span>
      );
    }
    if (rawLevel === 'medium' || rawLevel === 'moderate' || rawLevel === 'amber') {
      return (
        <span className="badge badge-medium" style={{ fontSize: '0.7rem' }}>
          Medium
        </span>
      );
    }
    if (rawLevel === 'high' || rawLevel === 'critical' || rawLevel === 'red') {
      return (
        <span className="badge badge-high" style={{ fontSize: '0.7rem' }}>
          High
        </span>
      );
    }
    return <span className="badge" style={{ backgroundColor: '#475569', color: '#cbd5e1', fontSize: '0.7rem' }}>{level || '—'}</span>;
  };

  const getStatusBadge = (status?: string) => {
    const rawStatus = (status || '').toLowerCase().trim();
    if (rawStatus === 'completed' || rawStatus === 'success' || rawStatus === 'published') {
      return (
        <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '0.7rem' }}>
          {status}
        </span>
      );
    }
    if (rawStatus === 'pending' || rawStatus === 'processing') {
      return (
        <span className="badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)', fontSize: '0.7rem' }}>
          {status}
        </span>
      );
    }
    return <span className="badge" style={{ backgroundColor: 'rgba(100, 116, 139, 0.1)', color: '#94a3b8', border: '1px solid rgba(100, 116, 139, 0.2)', fontSize: '0.7rem' }}>{status || '—'}</span>;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="card archive-card">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <History size={18} style={{ color: 'hsl(var(--accent-teal))' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Report Intelligence Archive</h2>
        </div>
        <span className="subtitle-text text-muted">Latest 10 runs</span>
      </div>

      <div className="table-container">
        {reports.length === 0 ? (
          <div className="empty-reports">
            <p>No historical reports found.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{ width: '12%' }}>Report Date</th>
                <th style={{ width: '40%' }}>Headline</th>
                <th style={{ width: '12%' }}>Risk Level</th>
                <th style={{ width: '10%' }}>Risk Score</th>
                <th style={{ width: '10%' }}>Status</th>
                <th style={{ width: '16%' }}>View Run</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <div style={{ fontWeight: 500, color: '#ffffff' }}>{formatDate(report.report_date)}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                      Run: {formatDateTime(report.created_at)}
                    </div>
                  </td>
                  <td className="headline-cell" title={report.headline}>
                    {displayValue(report.headline)}
                  </td>
                  <td>{getRiskBadge(report.risk_level)}</td>
                  <td>
                    {report.risk_score !== undefined ? (
                      <span style={{ fontWeight: 600, color: '#ffffff' }}>{report.risk_score}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>{getStatusBadge(report.status)}</td>
                  <td>
                    <button className="btn-secondary btn-table-view" onClick={() => onViewDetails(report)}>
                      <Eye size={12} /> Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        .archive-card {
          padding: 24px;
        }
        .subtitle-text {
          font-size: 0.8rem;
        }
        .empty-reports {
          padding: 30px;
          text-align: center;
          color: #64748b;
        }
        .headline-cell {
          font-size: 0.85rem;
          color: #e2e8f0;
          font-weight: 500;
          max-width: 250px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .btn-table-view {
          padding: 5px 10px;
          font-size: 0.75rem;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
      `}</style>
    </div>
  );
};
