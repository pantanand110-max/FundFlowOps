import React, { useEffect, useState } from 'react';
import { RefreshCw, Play, CheckCircle2, ShieldAlert, Loader2, Circle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { KpiCard } from './KpiCard';
import { LatestReport } from './LatestReport';
import { SignalsTable } from './SignalsTable';
import { RiskIntelligenceCenter } from './RiskIntelligenceCenter';
import { MarketRegimeCenter } from './MarketRegimeCenter';
import { AIExplainabilityCenter } from './AIExplainabilityCenter';
import { MarketChangeAnalysis } from './MarketChangeAnalysis';
import { ArchitectureCenter } from './ArchitectureCenter';
import { InterviewMode } from './InterviewMode';
import { ReportArchive } from './ReportArchive';
import { ReportDrilldown } from './ReportDrilldown';
import { getJson, formatFiiDii, formatPercent, getParsedRiskAnalysis, getParsedRegimeAnalysis } from '../utils/helpers';

interface MarketReport {
  id: string;
  created_at: string;
  report_date?: string;
  report_type?: string;
  headline?: string;
  market_summary?: string;
  stakeholder_summary?: string;
  risk_level?: string;
  risk_score?: number;
  kpi_json?: any;
  ai_report_json?: any;
  status?: string;
  source?: string;
  model_used?: string;
}

interface Signal {
  id: string;
  report_id?: string;
  created_at?: string;
  signal_title?: string;
  severity?: string;
  signal_type?: string;
  explanation?: string;
  suggested_action?: string;
}

export const Dashboard: React.FC = () => {
  // Data State
  const [latestReport, setLatestReport] = useState<MarketReport | null>(null);
  const [previousReport, setPreviousReport] = useState<MarketReport | null>(null);
  const [latestSignals, setLatestSignals] = useState<Signal[]>([]);
  const [previousSignals, setPreviousSignals] = useState<Signal[]>([]);
  const [archiveReports, setArchiveReports] = useState<MarketReport[]>([]);
  
  // Drilldown Drawer State
  const [selectedReport, setSelectedReport] = useState<MarketReport | null>(null);
  const [selectedSignals, setSelectedSignals] = useState<Signal[]>([]);
  const [isDrilldownOpen, setIsDrilldownOpen] = useState(false);

  // Status & Loading State
  const [isLoadingLatest, setIsLoadingLatest] = useState(true);
  const [isLoadingArchive, setIsLoadingArchive] = useState(true);
  const [isLoadingSelectedSignals, setIsLoadingSelectedSignals] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [isPresentationMode, setIsPresentationMode] = useState(() => localStorage.getItem('presentationMode') === 'true');
  const [isInterviewMode, setIsInterviewMode] = useState(() => localStorage.getItem('interviewMode') === 'true');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const togglePresentationMode = () => {
    setIsPresentationMode(prev => {
      const newVal = !prev;
      localStorage.setItem('presentationMode', String(newVal));
      return newVal;
    });
  };

  // Load dashboard data
  const loadDashboardData = async () => {
    setIsLoadingLatest(true);
    try {
      // 1. Fetch latest 2 reports
      const { data: reportData, error: reportErr } = await supabase
        .from('market_reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(2);

      if (reportErr) throw reportErr;

      if (reportData && reportData.length > 0) {
        const report = reportData[0] as MarketReport;
        setLatestReport(report);

        if (reportData.length > 1) {
          setPreviousReport(reportData[1] as MarketReport);
        } else {
          setPreviousReport(null);
        }

        // 2. Fetch signals for both reports
        const reportIds = reportData.map(r => r.id);
        const { data: signalsData, error: signalsErr } = await supabase
          .from('market_signals')
          .select('*')
          .in('report_id', reportIds);

        if (signalsErr) throw signalsErr;

        const latestSigs = (signalsData || []).filter(s => s.report_id === report.id);
        setLatestSignals(latestSigs);

        if (reportData.length > 1) {
          const prevSigs = (signalsData || []).filter(s => s.report_id === reportData[1].id);
          setPreviousSignals(prevSigs);
        } else {
          setPreviousSignals([]);
        }
      } else {
        setLatestReport(null);
        setPreviousReport(null);
        setLatestSignals([]);
        setPreviousSignals([]);
      }
    } catch (err: any) {
      console.error('Error fetching latest/previous reports or signals:', err);
    } finally {
      setIsLoadingLatest(false);
    }
  };

  const loadArchiveData = async () => {
    setIsLoadingArchive(true);
    try {
      const { data: archiveData, error: archiveErr } = await supabase
        .from('market_reports')
        .select('id, created_at, report_date, report_type, headline, risk_level, risk_score, status, source, model_used, kpi_json, ai_report_json, market_summary, stakeholder_summary')
        .order('created_at', { ascending: false })
        .limit(10);

      if (archiveErr) throw archiveErr;
      setArchiveReports(archiveData || []);
    } catch (err: any) {
      console.error('Error fetching archive reports:', err);
    } finally {
      setIsLoadingArchive(false);
    }
  };

  const loadSelectedReportSignals = async (reportId: string) => {
    setIsLoadingSelectedSignals(true);
    try {
      const { data: sigData, error: sigErr } = await supabase
        .from('market_signals')
        .select('*')
        .eq('report_id', reportId);

      if (sigErr) throw sigErr;
      setSelectedSignals(sigData || []);
    } catch (err) {
      console.error('Error fetching selected report signals:', err);
      setSelectedSignals([]);
    } finally {
      setIsLoadingSelectedSignals(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    loadArchiveData();
  }, []);

  // Drilldown Click Handler
  const handleViewReportDetails = async (report: MarketReport) => {
    setSelectedReport(report);
    setIsDrilldownOpen(true);
    await loadSelectedReportSignals(report.id);
  };

  // Generate Report Webhook Trigger
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setGenerationStep(0);
    setNotification(null);

    const timers: any[] = [];

    // Simulate progress steps over time
    timers.push(setTimeout(() => setGenerationStep(1), 3000));
    timers.push(setTimeout(() => setGenerationStep(2), 7000));
    timers.push(setTimeout(() => setGenerationStep(3), 15000));

    try {
      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
      if (!webhookUrl) {
        throw new Error('n8n Webhook URL environment variable is missing.');
      }

      // Check for the secret header environment variable
      if (!import.meta.env.VITE_FUND_FLOWOPS_SECRET) {
        console.error("Missing VITE_FUND_FLOWOPS_SECRET");
      }

      // Capture current latest report ID to check for changes after generation
      const previousLatestId = latestReport ? latestReport.id : null;

      // Execute POST request to production n8n webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-fundflowops-secret': import.meta.env.VITE_FUND_FLOWOPS_SECRET || "",
        },
        body: JSON.stringify({
          source: 'FundFlowOps Command Center',
          request_time: new Date().toISOString(),
        }),
      });

      if (response.status === 401) {
        throw new Error('Unauthorized: security header missing or invalid. Check frontend .env secret.');
      }

      if (!response.ok) {
        throw new Error(`Trigger Failed: Server responded with status ${response.status}`);
      }

      // Clear simulated timers
      timers.forEach(t => clearTimeout(t));
      
      // Instantly advance to final step (Refreshing Dashboard)
      setGenerationStep(4);

      // Poll database until a new report is written (up to 35s timeout)
      let newReportDetected = false;
      const startTime = Date.now();
      const timeoutMs = 35000;

      while (Date.now() - startTime < timeoutMs) {
        const { data: checkData } = await supabase
          .from('market_reports')
          .select('id')
          .order('created_at', { ascending: false })
          .limit(1);

        if (checkData && checkData.length > 0 && checkData[0].id !== previousLatestId) {
          newReportDetected = true;
          break;
        }
        // Wait 2 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Refetch components using created_at ordering (handled inside the loaders)
      await loadDashboardData();
      await loadArchiveData();

      // Brief delay to let the user see the complete state before closing
      await new Promise(resolve => setTimeout(resolve, 1000));

      setNotification({
        type: 'success',
        message: newReportDetected 
          ? 'Market Intelligence Report Generated' 
          : 'Dashboard refreshed. No new report detected in 35 seconds.',
      });
    } catch (error: any) {
      console.error('Error triggering webhook:', error);
      const errorMsg = error.message || 'Network error';
      const displayMsg = errorMsg.includes('Unauthorized') 
        ? errorMsg 
        : `Generation Trigger Error: ${errorMsg}`;
      setNotification({
        type: 'error',
        message: displayMsg,
      });
    } finally {
      timers.forEach(t => clearTimeout(t));
      setIsGenerating(false);
      // Auto dismiss notifications after 8 seconds
      setTimeout(() => setNotification(null), 8000);
    }
  };

  const handleRefresh = async () => {
    await loadDashboardData();
    await loadArchiveData();
    setNotification({
      type: 'success',
      message: 'Dashboard data successfully refreshed.',
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCopySummary = async () => {
    if (!latestReport) return;

    const reportDate = latestReport.report_date 
      ? new Date(latestReport.report_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) 
      : '—';

    // Format confidence value safely as a number
    let confidenceVal = latestRegime?.confidence ?? '—';
    if (typeof confidenceVal === 'number') {
      if (confidenceVal > 0 && confidenceVal <= 1) {
        confidenceVal = Math.round(confidenceVal * 100);
      } else {
        confidenceVal = Math.round(confidenceVal);
      }
    }

    // Top 3 signals
    const top3Signals = latestSignals.slice(0, 3);
    const signalsListText = top3Signals.length > 0
      ? top3Signals.map(sig => `• ${sig.signal_title || '—'}: ${sig.explanation || '—'}`).join('\n')
      : '• No active signals detected for this operations period.';

    const formattedSummary = `FUND FLOW OPS – MARKET INTELLIGENCE SUMMARY

Date: ${reportDate}

Headline:
${latestReport.headline || '—'}

Market Summary:
${latestReport.market_summary || '—'}

Stakeholder Summary:
${latestReport.stakeholder_summary || '—'}

Risk Level:
${latestRisk?.risk_level || '—'}

Risk Score:
${latestRisk?.risk_score !== undefined ? `${latestRisk.risk_score}/100` : '—'}

Market Regime:
${latestRegime?.market_regime || '—'}

Confidence:
${confidenceVal}%

Top Signals:
${signalsListText}

Generated by FundFlowOps AI Intelligence Engine`;

    try {
      await navigator.clipboard.writeText(formattedSummary);
      setNotification({
        type: 'success',
        message: 'Executive Summary copied to clipboard',
      });
      setTimeout(() => setNotification(null), 4000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setNotification({
        type: 'error',
        message: 'Failed to copy summary to clipboard',
      });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  // Parse KPI metrics for latest report
  const latestKpis = latestReport ? getJson(latestReport.kpi_json) : {};
  const latestRisk = getParsedRiskAnalysis(latestReport);
  const latestRegime = getParsedRegimeAnalysis(latestReport);

  const getHealthStatuses = () => {
    if (!latestReport) {
      return {
        marketData: 'red' as const,
        aiEngine: 'red' as const,
        riskEngine: 'red' as const,
        regimeEngine: 'red' as const,
        database: 'red' as const,
        workflow: 'red' as const,
        lastUpdated: 'No data loaded'
      };
    }

    const now = new Date();
    const reportTime = new Date(latestReport.created_at);
    const msDiff = now.getTime() - reportTime.getTime();
    const hoursDiff = msDiff / (1000 * 60 * 60);
    const within24h = hoursDiff <= 24;

    const rawAiJson = getJson(latestReport.ai_report_json);
    const hasAiJson = latestReport.ai_report_json && Object.keys(rawAiJson).length > 0;
    const hasRiskAnalysis = rawAiJson.risk_analysis !== undefined && rawAiJson.risk_analysis !== null;
    const hasRegimeAnalysis = rawAiJson.market_regime_analysis !== undefined && rawAiJson.market_regime_analysis !== null;

    return {
      marketData: within24h ? ('green' as const) : ('red' as const),
      aiEngine: hasAiJson ? ('green' as const) : ('red' as const),
      riskEngine: hasRiskAnalysis ? ('green' as const) : ('red' as const),
      regimeEngine: hasRegimeAnalysis ? ('green' as const) : ('red' as const),
      database: 'green' as const,
      workflow: within24h ? ('green' as const) : ('amber' as const),
      lastUpdated: new Date(latestReport.created_at).toLocaleString('en-IN')
    };
  };

  const health = getHealthStatuses();

  const renderHealthDot = (status: 'green' | 'amber' | 'red') => {
    const color = status === 'green' ? '#10b981' : status === 'amber' ? '#f59e0b' : '#ef4444';
    return (
      <span className="health-dot" style={{
        display: 'inline-block',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: color,
        boxShadow: `0 0 6px ${color}`,
        flexShrink: 0
      }} />
    );
  };

  const renderStepStatus = (stepIndex: number) => {
    if (generationStep > stepIndex) {
      return <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0 }} />;
    }
    if (generationStep === stepIndex) {
      return <Loader2 size={16} className="spin-anim" style={{ color: 'hsl(var(--accent-teal))', flexShrink: 0 }} />;
    }
    return <Circle size={16} style={{ color: '#475569', flexShrink: 0 }} />;
  };

  if (isInterviewMode) {
    return (
      <InterviewMode
        onBackToDashboard={() => {
          setIsInterviewMode(false);
          localStorage.setItem('interviewMode', 'false');
        }}
      />
    );
  }

  return (
    <div className={`dashboard-container ${isPresentationMode ? 'presentation-mode' : ''}`}>
      {/* Top Banner Alert/Notification */}
      {notification && (
        <div className={`notification-banner ${notification.type === 'success' ? 'banner-success' : 'banner-error'}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {notification.type === 'success' ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{notification.message}</span>
          </div>
          <button className="banner-close" onClick={() => setNotification(null)}>✕</button>
        </div>
      )}

      {/* Generating Overlay Indicator */}
      {isGenerating && (
        <div className="generating-overlay">
          <div className="generating-status-card card">
            <div className="spinner-glow" style={{ animation: 'spin 1.5s linear infinite' }}></div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '4px', fontWeight: 700, color: '#ffffff' }}>
              Generating Market Intelligence
            </h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '20px' }}>
              Building AI-powered market operations report.
            </p>

            <div className="progress-steps-container">
              <div className={`step-row ${generationStep === 0 ? 'step-active' : generationStep > 0 ? 'step-completed' : ''}`}>
                {renderStepStatus(0)}
                <span className="step-label">Market Data Loading</span>
              </div>
              <div className={`step-row ${generationStep === 1 ? 'step-active' : generationStep > 1 ? 'step-completed' : ''}`}>
                {renderStepStatus(1)}
                <span className="step-label">KPI Analysis</span>
              </div>
              <div className={`step-row ${generationStep === 2 ? 'step-active' : generationStep > 2 ? 'step-completed' : ''}`}>
                {renderStepStatus(2)}
                <span className="step-label">AI Intelligence Generation</span>
              </div>
              <div className={`step-row ${generationStep === 3 ? 'step-active' : generationStep > 3 ? 'step-completed' : ''}`}>
                {renderStepStatus(3)}
                <span className="step-label">Saving Report</span>
              </div>
              <div className={`step-row ${generationStep === 4 ? 'step-active' : generationStep > 4 ? 'step-completed' : ''}`}>
                {renderStepStatus(4)}
                <span className="step-label">Refreshing Dashboard</span>
              </div>
            </div>

            <div className="estimated-time-box">
              Estimated time: 15–30 seconds
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Header */}
      <header className="dashboard-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 800 }}>FundFlowOps Command Center</h1>
            {isPresentationMode && (
              <span className="badge presentation-badge" style={{ backgroundColor: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.3)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                PRESENTATION MODE ACTIVE
              </span>
            )}
          </div>
          <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '4px' }}>
            AI Operations Intelligence for Indian Capital Market Teams
          </p>
        </div>
        
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className={`btn-secondary presentation-toggle-btn ${isPresentationMode ? 'active-toggle' : ''}`} onClick={togglePresentationMode}>
            🎤 {isPresentationMode ? 'Exit Presentation' : 'Presentation Mode'}
          </button>

          {!isPresentationMode && (
            <>
              <button className="btn-secondary" onClick={() => { setIsInterviewMode(true); localStorage.setItem('interviewMode', 'true'); }}>
                🎓 Interview Mode
              </button>

              <button className="btn-secondary" onClick={handleRefresh} disabled={isLoadingLatest || isLoadingArchive}>
                <RefreshCw size={14} className={isLoadingLatest || isLoadingArchive ? 'spin-anim' : ''} />
                Refresh
              </button>
              
              <button className="btn-primary pulse-animation" onClick={handleGenerateReport} disabled={isGenerating}>
                <Play size={14} fill="#0b0f19" />
                Generate Market Report
              </button>
            </>
          )}
        </div>
      </header>

      {/* System Health Panel */}
      {!isPresentationMode && (
        <div className="card health-panel-card" style={{ marginBottom: '24px', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'hsl(var(--accent-teal))', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            System Health
          </span>
          <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#475569' }} />
          <span className="text-muted" style={{ fontSize: '0.75rem' }}>
            Last Updated: {health.lastUpdated}
          </span>
        </div>
        
        <div className="health-status-list" style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div className="health-status-item">
            {renderHealthDot(health.marketData)}
            <span className="health-label">Market Data Feed</span>
          </div>
          <div className="health-status-item">
            {renderHealthDot(health.aiEngine)}
            <span className="health-label">AI Intelligence Engine</span>
          </div>
          <div className="health-status-item">
            {renderHealthDot(health.riskEngine)}
            <span className="health-label">Risk Intelligence Engine</span>
          </div>
          <div className="health-status-item">
            {renderHealthDot(health.regimeEngine)}
            <span className="health-label">Market Regime Engine</span>
          </div>
          <div className="health-status-item">
            {renderHealthDot(health.database)}
            <span className="health-label">Database</span>
          </div>
          <div className="health-status-item">
            {renderHealthDot(health.workflow)}
            <span className="health-label">Workflow</span>
          </div>
        </div>

        <style>{`
          .health-panel-card {
            border-color: hsla(var(--border-color) / 0.6);
            background: linear-gradient(135deg, hsla(var(--bg-surface) / 0.4) 0%, hsla(var(--bg-surface) / 0.65) 100%);
            border-radius: 12px;
          }
          .health-status-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 0.75rem;
            color: #cbd5e1;
            font-weight: 500;
          }
          .health-label {
            color: #94a3b8;
          }
        `}</style>
      </div>)}

      {/* Main Content Layout */}
      {isLoadingLatest ? (
        <div className="dashboard-loader">
          <div className="shimmer-card card" style={{ height: '120px', marginBottom: '24px' }}></div>
          <div className="grid-main">
            <div className="col-8 shimmer-card card" style={{ height: '400px' }}></div>
            <div className="col-4 shimmer-card card" style={{ height: '400px' }}></div>
          </div>
        </div>
      ) : (
        <>
          {/* KPI Cards Grid */}
          <section className="grid-kpi">
            <KpiCard
              title="Nifty 50 Change"
              value={formatPercent(latestKpis.nifty_change_pct)}
              type="index"
              change={parseFloat(latestKpis.nifty_change_pct)}
            />
            <KpiCard
              title="Bank Nifty Change"
              value={formatPercent(latestKpis.banknifty_change_pct)}
              type="index"
              change={parseFloat(latestKpis.banknifty_change_pct)}
            />
            <KpiCard
              title="FII Net Flow"
              value={formatFiiDii(latestKpis.fii_net_cr)}
              type="flow"
              change={parseFloat(latestKpis.fii_net_cr)}
              subtitle="Daily net purchases"
            />
            <KpiCard
              title="DII Net Flow"
              value={formatFiiDii(latestKpis.dii_net_cr)}
              type="flow"
              change={parseFloat(latestKpis.dii_net_cr)}
              subtitle="Daily net purchases"
            />
            <KpiCard
              title="India VIX"
              value={latestKpis.india_vix !== undefined ? latestKpis.india_vix : '—'}
              type="vix"
              subtitle="Market volatility index"
            />
            <KpiCard
              title="Overall Risk"
              value={latestReport?.risk_score !== undefined ? latestReport.risk_score : '—'}
              type="risk"
              subtitle={`Level: ${latestReport?.risk_level || '—'}`}
            />
          </section>

          {/* Central Workspace Grid */}
          <div className="grid-main">
            {/* Left Block: Summaries & Active Signals */}
            <div className="col-8 layout-flow-vertical">
              <LatestReport report={latestReport} onCopySummary={isPresentationMode ? undefined : handleCopySummary} isPresentationMode={isPresentationMode} />
              <SignalsTable signals={latestSignals} />
            </div>

            {/* Right Block: Regime & Risk Analysis */}
            <div className="col-4 layout-flow-vertical">
              <RiskIntelligenceCenter riskAnalysis={latestRisk} />
              <MarketRegimeCenter regimeAnalysis={latestRegime} />
              <AIExplainabilityCenter riskAnalysis={latestRisk} regimeAnalysis={latestRegime} />
            </div>
          </div>

          {/* Market Change Analysis */}
          {!isPresentationMode && (
            <MarketChangeAnalysis
              latestReport={latestReport}
              previousReport={previousReport}
              latestSignals={latestSignals}
              previousSignals={previousSignals}
            />
          )}
        </>
      )}

      {/* Historical Runs Archive Table */}
      {!isPresentationMode && (
        <section style={{ marginTop: '24px' }}>
          {isLoadingArchive ? (
            <div className="shimmer-card card" style={{ height: '300px' }}></div>
          ) : (
            <ReportArchive reports={archiveReports} onViewDetails={handleViewReportDetails} />
          )}
        </section>
      )}

      {/* Architecture & Data Flow Center */}
      {!isPresentationMode && (
        <ArchitectureCenter />
      )}

      {/* Report Drilldown View Drawer */}
      <ReportDrilldown
        isOpen={isDrilldownOpen}
        report={selectedReport}
        signals={selectedSignals}
        isLoadingSignals={isLoadingSelectedSignals}
        onClose={() => {
          setIsDrilldownOpen(false);
          setSelectedReport(null);
          setSelectedSignals([]);
        }}
      />

      <style>{`
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
          border-bottom: 1px solid hsl(var(--border-color));
          padding-bottom: 20px;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .layout-flow-vertical {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .spin-anim {
          animation: spin 1.2s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        /* Notification style */
        .notification-banner {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-width: 320px;
          max-width: 480px;
          padding: 14px 20px;
          border-radius: 12px;
          backdrop-filter: blur(12px);
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        .banner-success {
          background-color: rgba(16, 185, 129, 0.95);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: #ffffff;
        }
        .banner-error {
          background-color: rgba(239, 68, 68, 0.95);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ffffff;
        }
        .banner-close {
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 1rem;
          cursor: pointer;
          opacity: 0.8;
          padding-left: 12px;
        }
        .banner-close:hover {
          opacity: 1;
        }
        @keyframes slideDown {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Generating Overlay style */
        .generating-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(3, 7, 18, 0.85);
          backdrop-filter: blur(10px);
          z-index: 1200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .generating-status-card {
          max-width: 450px;
          text-align: center;
          padding: 36px;
          border: 1px solid hsla(var(--accent-teal) / 0.3);
          box-shadow: 0 0 40px hsla(var(--accent-teal) / 0.1);
          position: relative;
        }
        .spinner-glow {
          width: 48px;
          height: 48px;
          border: 4px solid hsla(var(--accent-teal) / 0.1);
          border-top-color: hsl(var(--accent-teal));
          border-radius: 50%;
          margin: 0 auto 20px auto;
          animation: spin 1s linear infinite;
          box-shadow: 0 0 15px hsla(var(--accent-teal) / 0.2);
        }

        /* Progress Steps styling */
        .progress-steps-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
          text-align: left;
          background: rgba(3, 7, 18, 0.4);
          padding: 18px;
          border-radius: 12px;
          border: 1px solid hsl(var(--border-color));
        }
        .step-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
          color: #475569;
          transition: all 0.3s ease;
        }
        .step-active {
          color: hsl(var(--accent-teal));
          font-weight: 600;
          animation: text-pulse 1.5s infinite alternate;
        }
        .step-completed {
          color: #cbd5e1;
        }
        .step-label {
          font-family: var(--font-main);
        }
        .estimated-time-box {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 500;
          border-top: 1px solid hsla(var(--border-color) / 0.4);
          padding-top: 12px;
          font-family: var(--font-display);
        }
        @keyframes text-pulse {
          0% { opacity: 0.8; }
          100% { opacity: 1; }
        }

        /* Shimmers & Loaders */
        .shimmer-card {
          background: linear-gradient(90deg, #0f172a 25%, #1e293b 50%, #0f172a 75%);
          background-size: 200% 100%;
          animation: loading-shimmer 1.5s infinite;
          border: 1px solid #1e293b;
        }
        @keyframes loading-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .dashboard-loader {
          padding-top: 10px;
        }

        /* Presentation Mode Overrides */
        .presentation-mode {
          max-width: 1550px !important;
          padding: 40px 32px !important;
        }
        .presentation-mode .card {
          margin-bottom: 32px !important;
          padding: 32px !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.45) !important;
          border-width: 1px !important;
        }
        .presentation-mode .kpi-value {
          font-size: 2.25rem !important;
        }
        .presentation-mode .report-headline {
          font-size: 1.85rem !important;
          margin-bottom: 12px !important;
        }
        .presentation-mode h2,
        .presentation-mode h3,
        .presentation-mode p,
        .presentation-mode li,
        .presentation-mode td,
        .presentation-mode th {
          font-size: 1.025em !important;
        }
        .presentation-mode .summary-content,
        .presentation-mode .explanation-cell,
        .presentation-mode .action-box,
        .presentation-mode .risk-text-para,
        .presentation-mode .regime-text-para {
          font-size: 0.95rem !important;
          line-height: 1.65 !important;
        }
        .presentation-toggle-btn.active-toggle {
          background-color: rgba(244, 63, 94, 0.15) !important;
          border-color: #f43f5e !important;
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
};
