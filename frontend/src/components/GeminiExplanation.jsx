import React, { useState } from 'react';
import { Sparkles, FileText, CheckSquare, AlertTriangle, ExternalLink, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function GeminiExplanation({ result }) {
  if (!result) return null;

  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (index) => {
    setCheckedItems(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const isFallback = result.is_fallback;
  const isFake = result.prediction === 'FAKE';

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-6">
      
      {/* Header with GenAI Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Generative AI Analysis & Guidance
              {isFallback ? (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                  Rule-Based Engine Active
                </span>
              ) : (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
                  {result.gemini_source || 'Gemini 2.5 Flash'}
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Summarization, factual claim decomposition, and independent fact-checking roadmap
            </p>
          </div>
        </div>

        <div className="text-[11px] px-3 py-1 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-indigo-300">
          Decoupled Explanatory Layer
        </div>
      </div>

      {/* Grid of Summary and Detailed Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Executive Summary */}
        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80">
          <div className="flex items-center space-x-2 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Objective Summary</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {result.summary || 'No summary available.'}
          </p>
        </div>

        {/* Detailed Explanation / Reasoning */}
        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80">
          <div className="flex items-center space-x-2 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Analytical Assessment</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {result.explanation || 'No explanation generated.'}
          </p>
        </div>

      </div>

      {/* Suspicious Indicators / Linguistic Cues */}
      {result.suspicious_indicators && result.suspicious_indicators.length > 0 && (
        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80">
          <div className="flex items-center space-x-2 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {isFake ? (
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>Linguistic & Sourcing Indicators</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {result.suspicious_indicators.map((indicator, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300"
              >
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                  isFake ? 'bg-rose-400' : 'bg-emerald-400'
                }`} />
                <span>{indicator}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Claims Extracted */}
      {result.key_claims && result.key_claims.length > 0 && (
        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80">
          <div className="flex items-center space-x-2 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
            <span>Extracted Primary Claims</span>
          </div>
          <ul className="space-y-2">
            {result.key_claims.map((claim, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-200"
              >
                <span className="font-mono text-indigo-400 font-semibold mt-0.5">
                  [{idx + 1}]
                </span>
                <span className="leading-relaxed">{claim}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Verification Suggestions Checklist */}
      {result.verification_suggestions && result.verification_suggestions.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-950/20 via-slate-950/80 to-slate-950/80 rounded-xl p-4 border border-indigo-900/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-indigo-300">
              <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
              <span>Recommended Verification Checklist</span>
            </div>
            <span className="text-[11px] text-slate-500">Interactive</span>
          </div>

          <div className="space-y-2">
            {result.verification_suggestions.map((suggestion, idx) => {
              const isChecked = !!checkedItems[idx];
              return (
                <label
                  key={idx}
                  onClick={() => toggleCheck(idx)}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition text-xs select-none ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300 line-through opacity-70'
                      : 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800"
                  />
                  <span className="leading-relaxed">{suggestion}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
