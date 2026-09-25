import React, { useState } from 'react';
import { Server, CheckCircle2, Copy, ExternalLink, Zap, Terminal, Shield, Key, X } from 'lucide-react';

interface McpStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const McpStatusModal: React.FC<McpStatusModalProps> = ({ isOpen, onClose }) => {
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('ventureflow_rapidapi_key') || '');
  const [keySaved, setKeySaved] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const mcpUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/mcp` : 'https://my-travel-planning-agent.vercel.app/api/mcp';
  const upstreamUrl = 'https://flights.flightpowers.com/mcp';

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText(mcpUrl);
    setCopiedEndpoint(true);
    setTimeout(() => setCopiedEndpoint(false), 2500);
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('ventureflow_rapidapi_key', apiKey.trim());
    } else {
      localStorage.removeItem('ventureflow_rapidapi_key');
    }
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2500);
  };

  const handleTestMcp = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: `test_${Date.now()}`,
          method: 'initialize',
          params: { protocolVersion: '2024-11-05' }
        })
      });
      const data = await res.json();
      setTestResult(data);
    } catch (e: any) {
      setTestResult({ error: e.message });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-display">Model Context Protocol (MCP) Hub</h2>
              <p className="text-[11px] text-slate-400">VentureFlow Agent & FlightPowers Google Flights Bridge</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto text-xs text-slate-300">
          {/* Active MCP Server Endpoints */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
              Local & Deployed MCP Server Endpoint
            </label>
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded p-2 px-3 font-mono text-[11px] text-cyan-300">
              <span className="truncate flex-1">{mcpUrl}</span>
              <button
                onClick={handleCopyEndpoint}
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title="Copy URL"
              >
                {copiedEndpoint ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Accepts Streamable HTTP & JSON-RPC 2.0 (protocol version <code>2024-11-05</code>).
            </p>
          </div>

          {/* Upstream MCP Server: FlightPowers */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-white">Upstream: FlightPowers Google Flights MCP</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Upstream
              </span>
            </div>
            <div className="text-[11px] text-slate-400 leading-relaxed">
              Provides live, unadulterated Google Flights search tools (<code className="text-cyan-300">search_oneway_flights</code>, <code className="text-cyan-300">search_roundtrip_flights</code>).
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span className="font-mono text-slate-500 truncate max-w-[280px]">{upstreamUrl}</span>
              <a
                href="https://flights.flightpowers.com/"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline inline-flex items-center gap-1 text-[11px]"
              >
                <span>Docs</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Optional RapidAPI Key Configuration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
                <Key className="w-3 h-3 text-cyan-400" />
                <span>Optional RapidAPI / FlightPowers Key</span>
              </label>
              <a
                href="https://rapidapi.com/mtnrabi/api/google-flights-live-api"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-cyan-400 hover:underline"
              >
                Get Free Tier Key
              </a>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste x-rapidapi-key (optional for unlimited queries)..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-600 font-mono focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={handleSaveApiKey}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
              >
                {keySaved ? 'Saved!' : 'Save'}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              When omitted, VentureFlow uses the free trial tier and curated real-time multi-modal cache.
            </p>
          </div>

          {/* Interactive Handshake Tester */}
          <div className="space-y-2 pt-1 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                <span>Test MCP Protocol Handshake</span>
              </span>
              <button
                onClick={handleTestMcp}
                disabled={isTesting}
                className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-medium transition-colors disabled:opacity-50"
              >
                {isTesting ? 'Pinging MCP...' : 'Send initialize'}
              </button>
            </div>

            {testResult && (
              <pre className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-300 max-h-36 overflow-y-auto">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 px-6 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>Transport: Streamable HTTP & JSON-RPC 2.0</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
