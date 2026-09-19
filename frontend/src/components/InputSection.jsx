import React from 'react';
import { Send, Trash2, Sparkles, AlertCircle, FileText, CheckCircle, ShieldAlert } from 'lucide-react';

const SAMPLES = [
  {
    title: "Sample Real News",
    tag: "Scientific / Verified",
    type: "real",
    text: "NASA's James Webb Space Telescope discovers atmospheric carbon dioxide and water vapor signatures on distant exoplanet 700 light-years away, according to a peer-reviewed study published in Nature Astronomy."
  },
  {
    title: "Sample Suspicious News",
    tag: "Sensationalist / Clickbait",
    type: "fake",
    text: "SHOCKING BOMBSHELL: Secret government lab accidentally releases mind-control nanobots into commercial municipal drinking water! Doctors and whistleblowers are outraged as Big Pharma suppresses this secret cure!"
  },
  {
    title: "Sample Tech / Policy",
    tag: "Institutional / Policy",
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

  const handleSampleClick = (sampleText) => {
    setText(sampleText);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      
      {/* Sample Selectors */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Quick Test Samples:
          </span>
          <span className="text-xs text-slate-500">Click to autofill</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {SAMPLES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSampleClick(sample.text)}
              disabled={isLoading}
              className={`text-left p-3 rounded-xl border transition-all text-xs flex flex-col justify-between group ${
                sample.type === 'real'
                  ? 'bg-emerald-950/20 border-emerald-800/40 hover:border-emerald-500/60 hover:bg-emerald-900/30'
                  : sample.type === 'fake'
                  ? 'bg-rose-950/20 border-rose-800/40 hover:border-rose-500/60 hover:bg-rose-900/30'
                  : 'bg-slate-800/40 border-slate-700/60 hover:border-indigo-500/60 hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5 w-full">
                <span className="font-semibold text-slate-200 group-hover:text-white flex items-center gap-1.5">
                  {sample.type === 'real' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                  {sample.type === 'fake' && <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />}
                  {sample.type === 'neutral' && <FileText className="w-3.5 h-3.5 text-indigo-400" />}
                  {sample.title}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  sample.type === 'real'
                    ? 'bg-emerald-500/10 text-emerald-300'
                    : sample.type === 'fake'
                    ? 'bg-rose-500/10 text-rose-300'
                    : 'bg-indigo-500/10 text-indigo-300'
                }`}>
                  {sample.tag}
                </span>
              </div>
              <p className="text-slate-400 text-[11px] line-clamp-2 leading-relaxed">
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
          placeholder="Paste a news article, press release, social media headline, or statement here to analyze its veracity and examine AI explanation..."
          disabled={isLoading}
          className="w-full bg-slate-950/90 border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl p-4 text-slate-100 placeholder-slate-500 text-sm leading-relaxed resize-y transition duration-150 disabled:opacity-50"
        />

        {/* Counter bar */}
        <div className="flex items-center justify-between mt-2 px-1 text-xs text-slate-400">
          <div className="flex items-center space-x-3">
            <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
            <span>•</span>
            <span>{charCount} characters</span>
          </div>
          {charCount > 15000 && (
            <span className="text-amber-400">Length will be trimmed to 25k chars</span>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Analysis Failed: </span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClear}
          disabled={isLoading || (!text && !error)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-medium border border-slate-700 transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={isLoading || !text.trim()}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analyzing Lexicon & Gemini Insights...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Analyze News</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
