import React from 'react';
import { TrendingUp, TrendingDown, Landmark, Activity, AlertOctagon, HelpCircle } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  type: 'index' | 'flow' | 'vix' | 'risk';
  change?: number; // raw value for color logic
  subtitle?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, type, change, subtitle }) => {
  const getIcon = () => {
    switch (type) {
      case 'index':
        return change && change >= 0 ? 
          <TrendingUp className="kpi-icon text-green" style={{ color: '#10b981' }} size={20} /> : 
          <TrendingDown className="kpi-icon text-red" style={{ color: '#ef4444' }} size={20} />;
      case 'flow':
        return <Landmark className="kpi-icon" style={{ color: '#06b6d4' }} size={20} />;
      case 'vix':
        return <Activity className="kpi-icon" style={{ color: '#3b82f6' }} size={20} />;
      case 'risk':
        return <AlertOctagon className="kpi-icon" style={{ color: '#f59e0b' }} size={20} />;
      default:
        return <HelpCircle size={20} />;
    }
  };

  const getValueColor = () => {
    if (type === 'index' || type === 'flow') {
      const val = typeof change === 'number' ? change : parseFloat(String(value));
      if (val > 0) return 'text-green-value';
      if (val < 0) return 'text-red-value';
    }
    if (type === 'risk') {
      const score = Number(value);
      if (score >= 70) return 'text-red-value';
      if (score >= 40) return 'text-orange-value';
      return 'text-green-value';
    }
    return '';
  };

  return (
    <div className="card kpi-card-wrapper" style={{ flex: 1, minWidth: '180px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {title}
        </span>
        {getIcon()}
      </div>
      <div className={`kpi-value ${getValueColor()}`} style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', margin: '4px 0' }}>
        {value}
      </div>
      {subtitle && (
        <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: '4px' }}>
          {subtitle}
        </div>
      )}
      
      <style>{`
        .kpi-card-wrapper {
          position: relative;
          overflow: hidden;
        }
        .kpi-card-wrapper::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: transparent;
          transition: background 0.3s;
        }
        .kpi-card-wrapper:hover::after {
          background: hsl(var(--accent-teal));
        }
        .text-green-value {
          color: #10b981;
        }
        .text-red-value {
          color: #ef4444;
        }
        .text-orange-value {
          color: #f59e0b;
        }
      `}</style>
    </div>
  );
};
