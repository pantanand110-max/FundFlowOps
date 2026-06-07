import React from 'react';
import { Layers, Database, Calculator, Cpu, ShieldAlert, Compass, LayoutDashboard, ArrowRight, ArrowDown, Server, GitBranch, Terminal } from 'lucide-react';

export const ArchitectureCenter: React.FC = () => {
  const steps = [
    {
      title: 'Google Sheets',
      desc: 'Market data source',
      icon: <Database size={16} style={{ color: '#10b981' }} />,
    },
    {
      title: 'KPI Engine',
      desc: 'Calculates FII, DII, VIX, PCR, Breadth metrics',
      icon: <Calculator size={16} style={{ color: '#3b82f6' }} />,
    },
    {
      title: 'Unified AI Agent',
      desc: 'Generates market intelligence report',
      icon: <Cpu size={16} style={{ color: '#8b5cf6' }} />,
    },
    {
      title: 'Risk Layer',
      desc: 'Identifies risks and monitoring actions',
      icon: <ShieldAlert size={16} style={{ color: '#ef4444' }} />,
    },
    {
      title: 'Regime Layer',
      desc: 'Determines market environment',
      icon: <Compass size={16} style={{ color: '#06b6d4' }} />,
    },
    {
      title: 'Supabase',
      desc: 'Stores reports and signals',
      icon: <Server size={16} style={{ color: '#f59e0b' }} />,
    },
    {
      title: 'Dashboard',
      desc: 'Visualizes intelligence and reports',
      icon: <LayoutDashboard size={16} style={{ color: 'hsl(var(--accent-teal))' }} />,
    },
  ];

  return (
    <div className="card architecture-card" style={{ marginTop: '24px' }}>
      <div className="card-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={20} style={{ color: 'hsl(var(--accent-teal))' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>FundFlowOps Architecture</h2>
        </div>
        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
          Visual workflow mapping data lifecycle and system dependencies
        </div>
      </div>

      <div className="arch-main-grid">
        {/* Pipeline Column */}
        <div className="arch-pipeline-col">
          <h3 className="arch-section-title">Data Pipeline Workflow</h3>
          <div className="pipeline-flow">
            {steps.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="flow-step-wrapper">
                  <div className="flow-step-card">
                    <div className="step-badge">0{idx + 1}</div>
                    <div className="step-header-info">
                      {step.icon}
                      <span className="step-title">{step.title}</span>
                    </div>
                    <p className="step-desc">{step.desc}</p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="arrow-container">
                      <ArrowRight size={14} className="arrow-horizontal" />
                      <ArrowDown size={14} className="arrow-vertical" />
                    </div>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Tech Stack Column */}
        <div className="arch-tech-col">
          <h3 className="arch-section-title">Technology Stack</h3>
          <div className="tech-stack-card">
            <div className="tech-item">
              <div className="tech-header">
                <Terminal size={12} style={{ color: 'hsl(var(--accent-teal))', marginRight: '4px' }} />
                <span className="tech-label">Frontend</span>
              </div>
              <span className="tech-value">React + Vite + TypeScript</span>
            </div>
            <div className="tech-item">
              <div className="tech-header">
                <GitBranch size={12} style={{ color: '#a855f7', marginRight: '4px' }} />
                <span className="tech-label">Workflow</span>
              </div>
              <span className="tech-value">n8n</span>
            </div>
            <div className="tech-item">
              <div className="tech-header">
                <Cpu size={12} style={{ color: '#3b82f6', marginRight: '4px' }} />
                <span className="tech-label">AI Engine</span>
              </div>
              <span className="tech-value">Gemini</span>
            </div>
            <div className="tech-item">
              <div className="tech-header">
                <Database size={12} style={{ color: '#10b981', marginRight: '4px' }} />
                <span className="tech-label">Database</span>
              </div>
              <span className="tech-value">Supabase</span>
            </div>
            <div className="tech-item">
              <div className="tech-header">
                <Server size={12} style={{ color: '#f59e0b', marginRight: '4px' }} />
                <span className="tech-label">Hosting</span>
              </div>
              <span className="tech-value">Local Docker + ngrok</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .architecture-card {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .arch-main-grid {
          display: grid;
          grid-template-columns: 4fr 1fr;
          gap: 20px;
        }
        .arch-section-title {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: hsl(var(--accent-teal));
          margin-bottom: 12px;
          font-weight: 700;
        }
        .pipeline-flow {
          display: flex;
          align-items: stretch;
          gap: 4px;
        }
        .flow-step-wrapper {
          display: flex;
          align-items: center;
          flex: 1;
        }
        .flow-step-card {
          background: hsla(var(--bg-base) / 0.2);
          border: 1px solid hsla(var(--border-color) / 0.25);
          border-radius: 12px;
          padding: 14px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-height: 140px;
          position: relative;
          transition: all var(--transition-fast);
        }
        .flow-step-card:hover {
          border-color: hsla(var(--accent-teal) / 0.25);
          background: hsla(var(--bg-surface-hover) / 0.3);
        }
        .step-badge {
          font-family: var(--font-display);
          font-size: 0.65rem;
          font-weight: 800;
          color: #64748b;
          align-self: flex-start;
          background: hsla(var(--border-color) / 0.4);
          padding: 2px 6px;
          border-radius: 4px;
        }
        .step-header-info {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .step-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: #e2e8f0;
        }
        .step-desc {
          font-size: 0.72rem;
          color: #94a3b8;
          line-height: 1.4;
          flex-grow: 1;
        }
        .arrow-container {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #475569;
          padding: 0 4px;
          flex-shrink: 0;
        }
        .arrow-vertical {
          display: none;
        }
        .arrow-horizontal {
          display: block;
        }
        
        /* Tech Stack Card Styling */
        .tech-stack-card {
          background: hsla(var(--bg-base) / 0.2);
          border: 1px solid hsla(var(--border-color) / 0.25);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          height: calc(100% - 28px);
          justify-content: space-between;
        }
        .tech-item {
          display: flex;
          flex-direction: column;
          gap: 3px;
          border-bottom: 1px solid hsla(var(--border-color) / 0.3);
          padding-bottom: 8px;
        }
        .tech-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .tech-header {
          display: flex;
          align-items: center;
        }
        .tech-label {
          font-size: 0.62rem;
          text-transform: uppercase;
          color: #64748b;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .tech-value {
          font-size: 0.78rem;
          color: #cbd5e1;
          font-weight: 600;
          padding-left: 16px;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1200px) {
          .arch-main-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .tech-stack-card {
            height: auto;
          }
        }
        @media (max-width: 1024px) {
          .pipeline-flow {
            flex-direction: column;
            gap: 10px;
          }
          .flow-step-wrapper {
            flex-direction: column;
            width: 100%;
          }
          .flow-step-card {
            width: 100%;
            min-height: auto;
            padding: 12px 14px;
          }
          .arrow-container {
            padding: 6px 0;
          }
          .arrow-horizontal {
            display: none;
          }
          .arrow-vertical {
            display: block;
          }
        }
      `}</style>
    </div>
  );
};
