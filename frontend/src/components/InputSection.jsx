import React from 'react';
import { Send, Trash2, Sparkles, AlertCircle, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

const SAMPLES = [
  {
    title: "Scientific / Institutional Press",
    tag: "REAL SAMPLE",
    type: "real",
    text: "NASA's James Webb Space Telescope discovers atmospheric carbon dioxide and water vapor signatures on distant exoplanet 700 light-years away, according to a peer-reviewed study published in Nature Astronomy."
  },
  {
    title: "Sensational Clickbait / Hoax",
    tag: "SUSPICIOUS SAMPLE",
    type: "fake",
    text: "SHOCKING BOMBSHELL: Secret government lab accidentally releases mind-control nanobots into commercial municipal drinking water! Doctors and whistleblowers are outraged as Big Pharma suppresses this secret cure!"
  },
  {
    title: "Regulatory Policy Statement",
    tag: "POLICY SAMPLE",
    type: "neutral",
    text: "The European Parliament votes overwhelmingly in favor of landmark comprehensive artificial intelligence regulatory framework, mandating strict transparency risk audits for foundation models."
  }
];

export default function InputSection({
  text,
  setText,
  onAnalyze,
  onClear,
  isLoading,
  error
}) {
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-sm">
      
      {/* Sample Selectors */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Test Bench Samples
          </span>
          <span className="text-xs text-slate-400">Click to load text</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {SAMPLES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setText(sample.text)}
              disabled={isLoading}
              className={`text-left p-3 rounded-lg border transition-all text-xs flex flex-col justify-between group ${
                sample.type === 'real'
                  ? 'bg-slate-50/70 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40'
                  : sample.type === 'fake'
                  ? 'bg-slate-50/70 border-slate-200 hover:border-rose-400 hover:bg-rose-50/40'
                  : 'bg-slate-50/70 border-slate-200 hover:border-slate-400 hover:bg-slate-100/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5 w-full">
                <span className="font-semibold text-slate-800 group-hover:text-slate-900 flex items-center gap-1.5">
                  {sample.type === 'real' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  {sample.type === 'fake' && <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />}
                  {sample.type === 'neutral' && <FileText className="w-3.5 h-3.5 text-slate-600" />}
                  {sample.title}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                  sample.type === 'real'
                    ? 'bg-emerald-100 text-emerald-800'
                    : sample.type === 'fake'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {sample.tag}
                </span>
              </div>
              <p className="text-slate-500 text-[11px] line-clamp-2 leading-relaxed">
                "{sample.text}"
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste news headline, article excerpt, press release, or viral social claim here to verify veracity..."
          disabled={isLoading}
          className="w-full bg-slate-50/50 border border-slate-200 focus:border-slate-700 focus:ring-1 focus:ring-slate-700 rounded-lg p-4 text-slate-900 placeholder-slate-400 text-sm leading-relaxed resize-y transition duration-150 disabled:opacity-50"
        />

        {/* Counter bar */}
        <div className="flex items-center justify-between mt-2 px-1 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} characters</span>
          </div>
          {charCount > 20000 && (
            <span className="text-amber-600">Text will be trimmed to 25,000 characters</span>
          )}
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Analysis Failed: </span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={onClear}
          disabled={isLoading || (!text && !error)}
          className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-medium border border-slate-200 transition flex items-center gap-1.5 disabled:opacity-40"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </button>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={isLoading || !text.trim()}
          className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition flex items-center gap-2 disabled:opacity-40 cursor-pointer"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analyzing Lexicon & Model Probabilities...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Verify & Analyze</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
