import React, { useState } from 'react';
import { FileText, CheckSquare, ExternalLink, ShieldAlert, CheckCircle2, Bot } from 'lucide-react';

export default function GeminiExplanation({ result }) {
  if (!result) return null;

  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (index) => {
    setCheckedItems(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const isFallback = result.is_fallback;
  const isFake = result.prediction === 'FAKE';

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Generative AI Analytical Guidance
              {isFallback ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                  Rule-Based Engine Active
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-medium font-mono">
                  {result.gemini_source || 'Gemini 2.5 Flash'}
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500">
              Summarization, factual claim decomposition, and independent fact-checking roadmap
            </p>
          </div>
        </div>

        <div className="text-[11px] px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-600 font-medium">
          Decoupled Explanatory Layer
        </div>
      </div>

      {/* Grid of Summary and Detailed Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Executive Summary */}
        <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/80">
          <div className="flex items-center space-x-1.5 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>Executive Summary</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif-headline">
            {result.summary || 'No summary available.'}
          </p>
        </div>

        {/* Analytical Assessment */}
        <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/80">
          <div className="flex items-center space-x-1.5 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Bot className="w-3.5 h-3.5 text-slate-600" />
            <span>AI Analytical Assessment</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif-headline">
            {result.explanation || 'No explanation generated.'}
          </p>
        </div>

      </div>

      {/* Suspicious Indicators */}
      {result.suspicious_indicators && result.suspicious_indicators.length > 0 && (
        <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/80">
          <div className="flex items-center space-x-2 mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {isFake ? (
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            )}
            <span>Rhetorical & Sourcing Indicators</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {result.suspicious_indicators.map((indicator, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700"
              >
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                  isFake ? 'bg-rose-500' : 'bg-emerald-500'
                }`} />
                <span>{indicator}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Claims Extracted */}
      {result.key_claims && result.key_claims.length > 0 && (
        <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/80">
          <div className="flex items-center space-x-2 mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <CheckSquare className="w-3.5 h-3.5 text-slate-600" />
            <span>Extracted Primary Claims</span>
          </div>
          <ul className="space-y-2">
            {result.key_claims.map((claim, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 font-serif-headline"
              >
                <span className="font-mono text-slate-400 font-semibold mt-0.5">
                  [{idx + 1}]
                </span>
                <span className="leading-relaxed">{claim}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Verification Checklist */}
      {result.verification_suggestions && result.verification_suggestions.length > 0 && (
        <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/80">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
              <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
              <span>Recommended Verification Roadmap</span>
            </div>
            <span className="text-[11px] text-slate-400">Interactive</span>
          </div>

          <div className="space-y-2">
            {result.verification_suggestions.map((suggestion, idx) => {
              const isChecked = !!checkedItems[idx];
              return (
                <label
                  key={idx}
                  onClick={() => toggleCheck(idx)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition text-xs select-none ${
                    isChecked
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800 line-through opacity-75'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
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
