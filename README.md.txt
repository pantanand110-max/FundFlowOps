# FundFlowOps Command Center

FundFlowOps is an AI-powered market operations intelligence dashboard that transforms market data into automated risk reports, market regime analysis, signal detection, and executive summaries.

## Project Structure

- `Frontend/` - React + Vite + TypeScript dashboard
- `Backend/` - n8n workflow, Supabase schema, backend setup notes

## Tech Stack

- Frontend: React, TypeScript, Vite
- Backend Automation: n8n
- AI Model: Gemini
- Database: Supabase
- Local Tunnel: ngrok
- Deployment: Vercel

## Key Features

- AI-generated market intelligence reports
- KPI dashboard
- Risk Intelligence Center
- Market Regime Center
- Signal detection
- Report archive and drilldown
- Executive summary export
- Presentation mode
- Webhook secret authentication
- Supabase Row Level Security

## Deployment

Deploy only the `Frontend/` folder on Vercel.

Required frontend environment variables:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_N8N_WEBHOOK_URL=
VITE_FUND_FLOWOPS_SECRET=