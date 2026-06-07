import React from 'react';
import { AlertCircle, TrendingUp, Layers, Terminal, Sparkles, ShieldCheck, Compass, ArrowLeft, Cpu, Database, Calculator, ShieldAlert, LayoutDashboard, ArrowRight, ArrowDown, Server, GitBranch } from 'lucide-react';

interface InterviewModeProps {
  onBackToDashboard: () => void;
}

export const InterviewMode: React.FC<InterviewModeProps> = ({ onBackToDashboard }) => {
  const sections = [
    { id: 'problem-statement', title: 'Problem Statement', icon: <AlertCircle size={16} /> },
    { id: 'business-value', title: 'Business Value', icon: <TrendingUp size={16} /> },
    { id: 'technical-architecture', title: 'Technical Architecture', icon: <Layers size={16} /> },
    { id: 'technology-stack', title: 'Technology Stack', icon: <Terminal size={16} /> },
    { id: 'key-features', title: 'Key Features', icon: <Sparkles size={16} /> },
    { id: 'challenges-solved', title: 'Challenges Solved', icon: <ShieldCheck size={16} /> },
    { id: 'future-roadmap', title: 'Future Roadmap', icon: <Compass size={16} /> },
  ];

  const archSteps = [
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

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="interview-mode-page">
      {/* Top sticky navigation header */}
      <header className="interview-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="badge interview-badge">🎓 Showcase Mode</div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>FundFlowOps Case Study & Overview</h1>
        </div>
        <button className="btn-primary" onClick={onBackToDashboard}>
          <ArrowLeft size={14} />
          Return to Dashboard
        </button>
      </header>

      <div className="interview-content-container">
        {/* Sticky Left Sidebar Navigation */}
        <aside className="interview-sidebar">
          <div className="sidebar-sticky-box">
            <h4 className="sidebar-heading">Navigation</h4>
            <nav className="sidebar-nav">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  className="sidebar-nav-btn"
                  onClick={() => handleScrollTo(sec.id)}
                >
                  {sec.icon}
                  <span>{sec.title}</span>
                </button>
              ))}
            </nav>
            <div className="sidebar-footer">
              FundFlowOps Operations Intelligence Engine.
            </div>
          </div>
        </aside>

        {/* Main Presentation Body */}
        <main className="interview-main">
          {/* 1. Problem Statement */}
          <section id="problem-statement" className="interview-section card">
            <div className="section-header">
              <AlertCircle size={22} className="text-teal" />
              <h2>1. Problem Statement</h2>
            </div>
            <div className="section-body">
              <p className="lead-text">
                For modern capital market operations and risk analysis teams, monitoring daily institutional cash flows is a manual, fragmented, and error-prone process.
              </p>
              <div className="points-grid">
                <div className="point-card">
                  <h5>Data Fragmentation</h5>
                  <p>Daily cash flows (FII and DII), volatility indicators (India VIX), derivative metrics (Put Call Ratio), and market breadth are scattered across multiple exchanges and portals, requiring manual consolidation.</p>
                </div>
                <div className="point-card">
                  <h5>Lack of Standard Interpretation</h5>
                  <p>Raw flow changes do not translate directly to risk metrics. Traders and risk managers must manually interpret flow anomalies without an automated baseline.</p>
                </div>
                <div className="point-card">
                  <h5>Regime Recognition Gaps</h5>
                  <p>Markets rotate through volatility and breadth regimes. Identifying market regimes is historically qualitative, leading to subjective strategy shifts.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Business Value */}
          <section id="business-value" className="interview-section card">
            <div className="section-header">
              <TrendingUp size={22} style={{ color: '#10b981' }} />
              <h2>2. Business Value</h2>
            </div>
            <div className="section-body">
              <p className="lead-text">
                FundFlowOps automates data aggregation and utilizes AI intelligence to yield actionable, objective risk frameworks for institutional teams.
              </p>
              <div className="metric-row">
                <div className="metric-box">
                  <span className="metric-num">98%</span>
                  <span className="metric-label">Reduction in Time-to-Report</span>
                </div>
                <div className="metric-box">
                  <span className="metric-num">100%</span>
                  <span className="metric-label">Standardized Ingestion Baseline</span>
                </div>
                <div className="metric-box">
                  <span className="metric-num">0</span>
                  <span className="metric-label">Manual Aggregation Errors</span>
                </div>
              </div>
              <ul className="value-bullets">
                <li><strong>Operational Acceleration:</strong> Shrinks daily intelligence report assembly from 40+ minutes of manual sheets copy-pasting to a 15–40 second background transaction.</li>
                <li><strong>Dynamic Risk Signal Baseline:</strong> Programmatic severity alerts flag institutional flow divergence, volatility spikes, and breadth deterioration instantly.</li>
                <li><strong>Executive Clarity:</strong> Transparent dashboard view with copy-to-clipboard summary templates translates complex micro-regimes into digestible talking points for daily morning standups.</li>
              </ul>
            </div>
          </section>

          {/* 3. Technical Architecture */}
          <section id="technical-architecture" className="interview-section card">
            <div className="section-header">
              <Layers size={22} style={{ color: '#8b5cf6' }} />
              <h2>3. Technical Architecture</h2>
            </div>
            <div className="section-body">
              <p className="lead-text">
                The data pipeline employs a serverless model where ingestion triggers calculation engines, feeding into a unified LLM layer before persisting and broadcasting.
              </p>

              {/* Embed Visual Flow */}
              <div className="visual-architecture-box">
                <h4 className="box-title">Visual Data Pipeline Workflow</h4>
                <div className="pipeline-flow-wrapper">
                  <div className="pipeline-flow-horizontal">
                    {archSteps.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <div className="flow-step-wrapper">
                          <div className="flow-step-card-mini">
                            <div className="step-badge">0{idx + 1}</div>
                            <div className="step-header-info">
                              {step.icon}
                              <span className="step-title">{step.title}</span>
                            </div>
                            <p className="step-desc">{step.desc}</p>
                          </div>
                          {idx < archSteps.length - 1 && (
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
              </div>
            </div>
          </section>

          {/* 4. Technology Stack */}
          <section id="technology-stack" className="interview-section card">
            <div className="section-header">
              <Terminal size={22} style={{ color: '#3b82f6' }} />
              <h2>4. Technology Stack</h2>
            </div>
            <div className="section-body">
              <p className="lead-text">
                FundFlowOps is constructed using robust, decoupled enterprise technologies supporting high speed and light memory consumption.
              </p>
              <div className="tech-cards-grid">
                <div className="tech-card">
                  <div className="card-top">
                    <Terminal size={16} style={{ color: 'hsl(var(--accent-teal))' }} />
                    <h5>Frontend</h5>
                  </div>
                  <p className="tech-spec">React (Vite) + TypeScript</p>
                  <p className="tech-desc">Provides a fast client UI loading under 100ms with a glassmorphism theme and custom styles.</p>
                </div>
                <div className="tech-card">
                  <div className="card-top">
                    <GitBranch size={16} style={{ color: '#a855f7' }} />
                    <h5>Workflow Integration</h5>
                  </div>
                  <p className="tech-spec">n8n</p>
                  <p className="tech-desc">Orchestrates spreadsheet polling, database writes, and handles third-party API webhook dispatches.</p>
                </div>
                <div className="tech-card">
                  <div className="card-top">
                    <Cpu size={16} style={{ color: '#ef4444' }} />
                    <h5>Artificial Intelligence</h5>
                  </div>
                  <p className="tech-spec">Gemini API Layer</p>
                  <p className="tech-desc">Translates numeric market data and trends into structured text summaries and risk classifications.</p>
                </div>
                <div className="tech-card">
                  <div className="card-top">
                    <Database size={16} style={{ color: '#10b981' }} />
                    <h5>Database & Storage</h5>
                  </div>
                  <p className="tech-spec">Supabase (PostgreSQL)</p>
                  <p className="tech-desc">Maintains relational schema maps for historical reports and operational signals.</p>
                </div>
                <div className="tech-card" style={{ gridColumn: 'span 2' }}>
                  <div className="card-top">
                    <Server size={16} style={{ color: '#f59e0b' }} />
                    <h5>Ingestion & Hosting</h5>
                  </div>
                  <p className="tech-spec">Local Docker Containerization + ngrok Secure Tunneling</p>
                  <p className="tech-desc">Enables local deployments of workflow servers to communicate safely with cloud database nodes and client domains through secure SSL proxies.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Key Features */}
          <section id="key-features" className="interview-section card">
            <div className="section-header">
              <Sparkles size={22} style={{ color: '#f59e0b' }} />
              <h2>5. Key Features</h2>
            </div>
            <div className="section-body">
              <div className="features-grid">
                <div className="feat-box">
                  <div className="feat-title">AI Explainability Center</div>
                  <p>Splits reports into transparent vectors (Risk Drivers, Actions, Regime Evidence, Recommended Focus) with zero raw JSON displays.</p>
                </div>
                <div className="feat-box">
                  <div className="feat-title">Market Change Analysis</div>
                  <p>Tracks run-to-run deltas for key indexes, flows, VIX, PCR, and details new, resolved, or adjusted signal severity states.</p>
                </div>
                <div className="feat-box">
                  <div className="feat-title">System Health Diagnostics</div>
                  <p>Small enterprise status display mapping feed latency, LLM response, database integrity, and workflow intervals.</p>
                </div>
                <div className="feat-box">
                  <div className="feat-title">Lockout report generation UX</div>
                  <p>Prevents redundant clicks and showcases a multi-step modal mapping active stages (Ingestion → AI → Save → Refresh).</p>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Challenges Solved */}
          <section id="challenges-solved" className="interview-section card">
            <div className="section-header">
              <ShieldCheck size={22} style={{ color: '#10b981' }} />
              <h2>6. Challenges Solved</h2>
            </div>
            <div className="section-body">
              <div className="timeline-challenges">
                <div className="challenge-item">
                  <div className="badge badge-high" style={{ alignSelf: 'flex-start' }}>Ingestion Fallback</div>
                  <h5>Handling Empty DB Reports</h5>
                  <p><strong>The Challenge:</strong> Webhook uploads lacked nested properties (e.g. `risk_analysis` or `market_regime_analysis` structures), which caused UI blocks to crash or render blank.</p>
                  <p><strong>The Fix:</strong> Implemented safe JSON parser fallbacks and regex checks (`helpers.ts`) which read the raw texts, volatility notes, or indices, ensuring all dashboard panels populate successfully without blank elements.</p>
                </div>
                <div className="challenge-item">
                  <div className="badge badge-medium" style={{ alignSelf: 'flex-start' }}>Race Prevention</div>
                  <h5>Generation Lockout UX</h5>
                  <p><strong>The Challenge:</strong> Processing report runs takes 15–40 seconds. Operators clicking multiple times triggered duplicate tasks in n8n, stressing API rates.</p>
                  <p><strong>The Fix:</strong> Designed a full-page modal lockout that disables triggers, animations, and renders active state indicators during transactions, refreshing the dashboard cleanly when finished.</p>
                </div>
                <div className="challenge-item">
                  <div className="badge badge-low" style={{ alignSelf: 'flex-start' }}>Data Optimization</div>
                  <h5>Run Delta Concurrency</h5>
                  <p><strong>The Challenge:</strong> Market Change Analysis requires comparing consecutive runs and their signals, multiplying DB fetch roundtrips.</p>
                  <p><strong>The Fix:</strong> Modified database loaders to query the last 2 records (`.limit(2)`) and fetch signals in a single `.in()` block, filtering arrays in memory to optimize load speeds.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 7. Future Roadmap */}
          <section id="future-roadmap" className="interview-section card">
            <div className="section-header">
              <Compass size={22} style={{ color: '#a855f7' }} />
              <h2>7. Future Roadmap</h2>
            </div>
            <div className="section-body">
              <div className="roadmap-grid">
                <div className="road-card">
                  <div className="road-phase">PHASE 1</div>
                  <h5>Historical Backtesting</h5>
                  <p>Implement backtesting configurations to evaluate AI risk flags against historical index drawdowns (e.g., Nifty corrections in 2024).</p>
                </div>
                <div className="road-card">
                  <div className="road-phase">PHASE 2</div>
                  <h5>Slack & Teams Broadcasters</h5>
                  <p>Integrate real-time notification targets to stream high-severity signals directly to operations chat channels.</p>
                </div>
                <div className="road-card">
                  <div className="road-phase">PHASE 3</div>
                  <h5>Consensus AI Models</h5>
                  <p>Add consensus scoring by cross-checking Gemini classifications against secondary LLM inferences to refine regime accuracy.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to action at bottom */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '40px' }}>
            <button className="btn-primary btn-large" onClick={onBackToDashboard}>
              <ArrowLeft size={16} />
              Return to Live Dashboard
            </button>
          </div>
        </main>
      </div>

      <style>{`
        .interview-mode-page {
          background-color: hsl(var(--bg-base));
          min-height: 100vh;
          color: #f1f5f9;
        }
        .interview-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: linear-gradient(180deg, hsl(var(--bg-surface)) 0%, hsla(var(--bg-surface) / 0.8) 100%);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid hsl(var(--border-color));
          padding: 16px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .interview-badge {
          background-color: hsla(var(--accent-teal-glow));
          color: hsl(var(--accent-teal));
          border: 1px solid hsla(var(--accent-teal) / 0.3);
          font-weight: 700;
          font-size: 0.7rem;
        }
        .interview-content-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 32px;
        }
        
        /* Sticky sidebar navigation */
        .interview-sidebar {
          position: relative;
        }
        .sidebar-sticky-box {
          position: sticky;
          top: 96px;
          background: linear-gradient(135deg, hsla(var(--bg-surface) / 0.4) 0%, hsla(var(--bg-surface) / 0.8) 100%);
          border: 1px solid hsl(var(--border-color));
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .sidebar-heading {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          border-bottom: 1px solid hsla(var(--border-color) / 0.5);
          padding-bottom: 8px;
          font-weight: 800;
        }
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .sidebar-nav-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
          padding: 8px 10px;
          border-radius: 6px;
          transition: all var(--transition-fast);
        }
        .sidebar-nav-btn:hover {
          color: #ffffff;
          background-color: hsla(var(--bg-surface-hover) / 0.5);
          padding-left: 14px;
        }
        .sidebar-footer {
          font-size: 0.65rem;
          color: #475569;
          line-height: 1.4;
          border-top: 1px solid hsla(var(--border-color) / 0.5);
          padding-top: 12px;
          margin-top: 8px;
        }
        
        /* Main presentation content area */
        .interview-main {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .interview-section {
          padding: 32px !important;
          scroll-margin-top: 96px;
        }
        .section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid hsla(var(--border-color) / 0.6);
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .section-header h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
        }
        .lead-text {
          font-size: 1rem;
          line-height: 1.6;
          color: #cbd5e1;
          margin-bottom: 24px;
          font-weight: 500;
        }
        
        /* Problem points card */
        .points-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .point-card {
          background-color: hsla(var(--bg-base) / 0.3);
          border: 1px solid hsla(var(--border-color) / 0.5);
          border-radius: 10px;
          padding: 16px;
        }
        .point-card h5 {
          font-size: 0.85rem;
          font-weight: 700;
          color: hsl(var(--accent-teal));
          margin-bottom: 8px;
        }
        .point-card p {
          font-size: 0.78rem;
          color: #94a3b8;
          line-height: 1.5;
        }
        
        /* Metrics values formatting */
        .metric-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }
        .metric-box {
          background: linear-gradient(135deg, hsla(var(--bg-surface) / 0.8) 0%, hsla(var(--bg-surface-hover) / 0.5) 100%);
          border: 1px solid hsla(var(--border-color) / 0.6);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }
        .metric-num {
          font-size: 2.25rem;
          font-weight: 800;
          color: #10b981;
          display: block;
          font-family: var(--font-display);
        }
        .metric-label {
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 600;
          text-transform: uppercase;
          margin-top: 4px;
          letter-spacing: 0.02em;
        }
        .value-bullets {
          padding-left: 20px;
          margin: 0;
        }
        .value-bullets li {
          font-size: 0.875rem;
          color: #cbd5e1;
          margin-bottom: 10px;
          line-height: 1.6;
        }
        
        /* Tech Stack grid styling */
        .tech-cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .tech-card {
          background-color: hsla(var(--bg-base) / 0.3);
          border: 1px solid hsla(var(--border-color) / 0.5);
          border-radius: 10px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .card-top {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .card-top h5 {
          font-size: 0.82rem;
          font-weight: 700;
          color: #e2e8f0;
        }
        .tech-spec {
          font-size: 0.78rem;
          font-weight: 700;
          color: hsl(var(--accent-teal));
        }
        .tech-desc {
          font-size: 0.75rem;
          color: #94a3b8;
          line-height: 1.5;
        }
        
        /* Key features list */
        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .feat-box {
          background: linear-gradient(135deg, hsla(var(--bg-surface) / 0.5) 0%, hsla(var(--bg-surface-hover) / 0.3) 100%);
          border: 1px solid hsla(var(--border-color) / 0.5);
          border-radius: 12px;
          padding: 18px;
        }
        .feat-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 6px;
          border-bottom: 1px solid hsla(var(--border-color) / 0.5);
          padding-bottom: 6px;
        }
        .feat-box p {
          font-size: 0.8rem;
          color: #cbd5e1;
          line-height: 1.5;
        }
        
        /* Challenges timeline view */
        .timeline-challenges {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .challenge-item {
          background-color: hsla(var(--bg-base) / 0.25);
          border: 1px solid hsla(var(--border-color) / 0.4);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .challenge-item h5 {
          font-size: 0.9rem;
          font-weight: 700;
          color: #ffffff;
        }
        .challenge-item p {
          font-size: 0.8rem;
          color: #94a3b8;
          line-height: 1.5;
        }
        .challenge-item strong {
          color: #f1f5f9;
        }
        
        /* Roadmap grid styling */
        .roadmap-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .road-card {
          background-color: hsla(var(--bg-base) / 0.3);
          border: 1px solid hsla(var(--border-color) / 0.5);
          border-radius: 10px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .road-phase {
          font-family: var(--font-display);
          font-size: 0.65rem;
          font-weight: 800;
          color: #a855f7;
          background: rgba(168, 85, 247, 0.1);
          border: 1px solid rgba(168, 85, 247, 0.2);
          padding: 2px 6px;
          border-radius: 4px;
          align-self: flex-start;
        }
        .road-card h5 {
          font-size: 0.85rem;
          font-weight: 700;
          color: #ffffff;
        }
        .road-card p {
          font-size: 0.78rem;
          color: #94a3b8;
          line-height: 1.5;
        }
        
        /* Embedded Visual Architecture Mini Flow */
        .visual-architecture-box {
          background-color: hsla(var(--bg-base) / 0.3);
          border: 1px solid hsla(var(--border-color) / 0.5);
          border-radius: 12px;
          padding: 20px;
          margin-top: 16px;
        }
        .pipeline-flow-wrapper {
          overflow-x: auto;
          width: 100%;
        }
        .pipeline-flow-horizontal {
          display: flex;
          align-items: stretch;
          gap: 4px;
          min-width: 900px;
        }
        .flow-step-card-mini {
          background: hsla(var(--bg-surface) / 0.5);
          border: 1px solid hsla(var(--border-color) / 0.4);
          border-radius: 10px;
          padding: 10px 12px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-height: 100px;
        }
        .flow-step-card-mini .step-badge {
          padding: 1px 4px;
          font-size: 0.55rem;
        }
        .flow-step-card-mini .step-title {
          font-size: 0.72rem;
        }
        .flow-step-card-mini .step-desc {
          font-size: 0.62rem;
          line-height: 1.3;
        }
        
        .btn-large {
          padding: 12px 24px;
          font-size: 0.95rem;
        }

        /* Responsiveness for interview container */
        @media (max-width: 1024px) {
          .interview-content-container {
            grid-template-columns: 1fr;
            padding: 16px;
          }
          .interview-sidebar {
            display: none; /* Hide sticky sidebar on tablet/mobile for more workspace space */
          }
          .points-grid, .metric-row, .roadmap-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .tech-cards-grid, .features-grid {
            grid-template-columns: 1fr;
          }
          .tech-card {
            grid-column: span 1 !important;
          }
          .pipeline-flow-horizontal {
            flex-direction: column;
            min-width: auto;
            gap: 10px;
          }
          .flow-step-card-mini {
            min-height: auto;
          }
          .arrow-horizontal {
            display: none;
          }
          .arrow-vertical {
            display: block;
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
};
