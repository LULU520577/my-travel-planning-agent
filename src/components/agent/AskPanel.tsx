import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Loader2, 
  Wrench, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ServerOff, 
  Clock, 
  ChevronRight,
  Code,
  X
} from 'lucide-react';

interface ToolCallItem {
  name: string;
  args: Record<string, any>;
  failed: boolean;
}

interface UnavailableServerItem {
  address: string;
  reason: string;
}

interface AskResponse {
  answer: string;
  tool_calls: ToolCallItem[];
  unavailable: UnavailableServerItem[];
  model: string;
  answered_at: string;
}

interface AskPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AskPanel: React.FC<AskPanelProps> = ({ isOpen, onClose }) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AskResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAsk = async (queryText?: string) => {
    const q = (queryText !== undefined ? queryText : question).trim();
    if (!q) return;

    if (queryText !== undefined) {
      setQuestion(queryText);
    }

    setIsLoading(true);
    setError(null);

    try {
      // Browser code calls ONLY /api/ask
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: q })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || `Request failed with status ${res.status}`);
        return;
      }

      setResponse(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to communicate with /api/ask');
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    'What hotels are recommended in Kyoto?',
    'What destinations can I discover for food and culture?',
    'Calculate the transit distance and ETA between Arashiyama and Gion',
    'Find flights from JFK to Tokyo'
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[540px] md:w-[620px] bg-slate-950/98 border-l border-slate-800 shadow-2xl z-50 flex flex-col backdrop-blur-md animate-in slide-in-from-right duration-200">
      {/* Panel Header */}
      <div className="h-14 px-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <span>Ask Agent</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-500/30">
                POST /api/ask
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Gemini 3.8 Flash selecting tools across connected MCP servers
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close Ask Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Question Input Box */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Your Question</span>
            <span className="text-[10px] font-mono text-slate-500">{question.length}/500 chars</span>
          </label>
          <div className="relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value.slice(0, 500))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAsk();
                }
              }}
              rows={3}
              placeholder="Ask anything about flights, hotels, transit routing, or destination planning..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 resize-none font-sans"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Answers strictly from tool results (max 120 words)</span>
            </div>

            <button
              onClick={() => handleAsk()}
              disabled={isLoading || !question.trim()}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors inline-flex items-center gap-2 shrink-0 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Consulting MCPs...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask Agent</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="pt-2">
            <p className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-1.5">
              Suggested Test Prompts:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(q)}
                  disabled={isLoading}
                  className="text-left text-[11px] px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-850 hover:border-slate-700 text-slate-300 border border-slate-800 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-lg border border-rose-900/60 bg-rose-950/30 p-3.5 text-xs text-rose-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-white">Error</span>
              <p className="text-rose-300 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Answer Section */}
        {response && (
          <div className="space-y-4 pt-2">
            {/* Answer Box */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5" />
                  <span>Agent Answer</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {response.model} · {new Date(response.answered_at).toLocaleTimeString()}
                </span>
              </div>

              <div className="text-xs text-slate-100 leading-relaxed whitespace-pre-line font-sans">
                {response.answer || 'No answer text returned.'}
              </div>
            </div>

            {/* Every tool called, in order, with its arguments */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Tools Called ({response.tool_calls.length})</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  In execution order
                </span>
              </div>

              {response.tool_calls.length === 0 ? (
                <div className="rounded-lg border border-slate-800/80 bg-slate-900/30 p-3 text-xs text-slate-400 italic">
                  No MCP tools were called for this response.
                </div>
              ) : (
                <div className="space-y-2">
                  {response.tool_calls.map((tool, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            #{idx + 1}
                          </span>
                          <span className="font-mono font-bold text-cyan-300">
                            {tool.name}
                          </span>
                        </div>

                        {tool.failed ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/40">
                            <XCircle className="w-3 h-3 text-rose-400" />
                            <span>Failed</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Executed</span>
                          </span>
                        )}
                      </div>

                      {/* Tool Arguments */}
                      <div className="bg-slate-900/90 rounded border border-slate-800/90 p-2 font-mono text-[11px] text-slate-300 overflow-x-auto">
                        <div className="text-[10px] uppercase text-slate-500 font-semibold mb-1 flex items-center gap-1">
                          <Code className="w-3 h-3" />
                          <span>Arguments</span>
                        </div>
                        <pre className="text-[11px] text-slate-300 whitespace-pre-wrap">
                          {JSON.stringify(tool.args, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Unavailable Servers in Grey */}
            {response.unavailable && response.unavailable.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <ServerOff className="w-3.5 h-3.5 text-slate-500" />
                  <span>Unavailable MCP Servers ({response.unavailable.length})</span>
                </span>

                <div className="space-y-1.5">
                  {response.unavailable.map((un, idx) => (
                    <div
                      key={idx}
                      className="rounded border border-slate-800/80 bg-slate-900/40 p-2.5 text-xs font-mono text-slate-400 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-semibold truncate max-w-[340px]">
                          {un.address}
                        </span>
                        <span className="text-[10px] text-slate-500 bg-slate-800/80 px-1.5 py-0.5 rounded">
                          Skipped
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-sans line-clamp-2">
                        Reason: {un.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
