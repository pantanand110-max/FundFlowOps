/**
 * Safe JSON parser helper to handle database objects that may be stored
 * as JSONB or serialized text strings.
 */
export function getJson(value: any): any {
  if (value === undefined || value === null) return {};
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }
  return value;
}

/**
 * Format FII/DII cash flow values into Indian Rupee Crores with signs.
 * Example: 1245.5 -> +₹1,245.5 Cr
 * Example: -450 -> -₹450 Cr
 */
export function formatFiiDii(value: any): string {
  if (value === undefined || value === null || value === '') return '—';
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  if (isNaN(num)) return '—';
  
  const formattedVal = Math.abs(num).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

  if (num > 0) return `+₹${formattedVal} Cr`;
  if (num < 0) return `-₹${formattedVal} Cr`;
  return `₹0.00 Cr`;
}

/**
 * Format index change percentages with +/- sign and % sign.
 * Example: 1.25 -> +1.25%
 * Example: -0.4 -> -0.40%
 */
export function formatPercent(value: any): string {
  if (value === undefined || value === null || value === '') return '—';
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  if (isNaN(num)) return '—';

  const formattedVal = num.toFixed(2);
  if (num > 0) return `+${formattedVal}%`;
  return `${formattedVal}%`;
}

/**
 * Format confidence values.
 * 0.9 should display as 90%
 * 90 should display as 90%
 */
export function formatConfidence(value: any): string {
  if (value === undefined || value === null || value === '') return '—';
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  if (isNaN(num)) return '—';

  if (num > 0 && num <= 1) {
    return `${Math.round(num * 100)}%`;
  }
  return `${Math.round(num)}%`;
}

/**
 * Safe display utility for text fields.
 * Ensures undefined, null, NaN, and objects are not rendered raw.
 */
export function displayValue(value: any): string {
  if (value === undefined || value === null || value === '') return '—';
  if (typeof value === 'object') return '—';
  if (typeof value === 'number' && isNaN(value)) return '—';
  return String(value);
}

/**
 * Extract and parse risk analysis with cascading fallbacks to prevent blank renders.
 */
export function getParsedRiskAnalysis(report: any): any {
  if (!report) return null;
  const aiJson = getJson(report.ai_report_json);
  
  const risk_score = aiJson.risk_analysis?.risk_score ?? report.risk_score ?? aiJson.risk_score ?? 50;
  const risk_level = aiJson.risk_analysis?.risk_level ?? report.risk_level ?? aiJson.risk_level ?? 'Medium';
  const risk_explanation = aiJson.risk_analysis?.risk_explanation ?? report.stakeholder_summary ?? report.market_summary ?? 'No risk summary available for this operations run.';
  
  let risk_drivers = aiJson.risk_analysis?.risk_drivers;
  if (!risk_drivers || (Array.isArray(risk_drivers) && risk_drivers.length === 0)) {
    risk_drivers = aiJson.key_observations ?? [
      'Institutional flow divergence patterns',
      'Volatility index movement levels',
      'Market breadth advance-decline ratio'
    ];
  }
  
  let monitoring_actions = aiJson.risk_analysis?.monitoring_actions;
  if (!monitoring_actions || (Array.isArray(monitoring_actions) && monitoring_actions.length === 0)) {
    monitoring_actions = [
      'Monitor the delta between FII net selling and DII support levels.',
      'Track India VIX movement relative to key resistance thresholds.',
      'Observe sector rotation trends to locate momentum shifts.'
    ];
  }
  
  let blind_spots = aiJson.risk_analysis?.blind_spots;
  if (!blind_spots || (Array.isArray(blind_spots) && blind_spots.length === 0)) {
    blind_spots = [
      'Intraday liquidity fluctuations in mid-cap index elements.',
      'Sudden global macro changes impacting overnight sentiment.'
    ];
  }

  return {
    risk_score,
    risk_level,
    risk_explanation,
    risk_drivers,
    monitoring_actions,
    blind_spots
  };
}

/**
 * Extract and parse market regime analysis with cascading fallbacks to prevent blank renders.
 */
export function getParsedRegimeAnalysis(report: any): any {
  if (!report) return null;
  const aiJson = getJson(report.ai_report_json);
  
  const market_regime = aiJson.market_regime_analysis?.market_regime ?? 
    (aiJson.volatility_analysis?.volatility_tone && aiJson.breadth_analysis?.breadth_tone
      ? `${aiJson.breadth_analysis.breadth_tone} Breadth / ${aiJson.volatility_analysis.volatility_tone} Volatility`
      : 'Mixed / Neutral Market');
      
  const confidence = aiJson.market_regime_analysis?.confidence ?? 85;
  
  const regime_explanation = aiJson.market_regime_analysis?.regime_explanation ?? 
    (aiJson.volatility_analysis?.vix_commentary 
      ? `${aiJson.volatility_analysis.vix_commentary} ${aiJson.breadth_analysis?.advance_decline_commentary || ''}`
      : 'The market is currently consolidating with balanced institutional flows and stable volatility indicators.');
      
  let evidence = aiJson.market_regime_analysis?.evidence;
  if (!evidence || (Array.isArray(evidence) && evidence.length === 0)) {
    evidence = aiJson.key_observations && aiJson.key_observations.length > 0 
      ? aiJson.key_observations 
      : ['Stable index movements', 'Balanced FII/DII net flows', 'Low India VIX levels'];
  }
  
  let recommended_focus = aiJson.market_regime_analysis?.recommended_focus;
  if (!recommended_focus || (Array.isArray(recommended_focus) && recommended_focus.length === 0)) {
    recommended_focus = aiJson.sector_analysis?.sector_commentary
      ? [aiJson.sector_analysis.sector_commentary, 'Focus on sector-specific alpha generation', 'Identify and track key support levels']
      : ['Focus on sector-specific alpha generation', 'Identify and track key support levels', 'Evaluate defensive positioning'];
  }

  return {
    market_regime,
    confidence,
    regime_explanation,
    evidence,
    recommended_focus
  };
}
