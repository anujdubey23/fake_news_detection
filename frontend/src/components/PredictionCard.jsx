import React from 'react';
import { ShieldCheck, ShieldAlert, Cpu, BarChart2, Tag } from 'lucide-react';

export default function PredictionCard({ result }) {
  if (!result) return null;

  const isFake = result.prediction === 'FAKE';
  const confidencePercent = (result.confidence * 100).toFixed(1);
  const realProbPercent = ((result.probabilities?.real ?? 0.5) * 100).toFixed(1);
  const fakeProbPercent = ((result.probabilities?.fake ?? 0.5) * 100).toFixed(1);

  return (
    <div className={`rounded-xl border p-6 bg-white shadow-sm transition-all ${
      isFake ? 'border-rose-200' : 'border-emerald-200'
    }`}>
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5 mb-5">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-slate-600" />
          <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Machine Learning Classification
          </span>
        </div>
        <span className="text-[11px] px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-mono">
          Model: TF-IDF + Logistic Regression
        </span>
      </div>

      {/* Main Result */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left: Result Badge */}
        <div className="md:col-span-5 flex flex-col items-start">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2.5 rounded-xl border ${
              isFake ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'
            }`}>
              {isFake ? <ShieldAlert className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                Evaluation Output
              </span>
              <div className={`text-3xl font-bold tracking-tight ${
                isFake ? 'text-rose-700' : 'text-emerald-700'
              }`}>
                {result.prediction}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
            {isFake
              ? 'Model detected high-weight sensationalist vocabulary, emotionally charged phrasing, or disinformation triggers.'
              : 'Model identified neutral terminology, empirical phrasing, and institutional journalistic cadence.'}
          </p>
        </div>

        {/* Middle: Confidence Bar */}
        <div className="md:col-span-4 bg-slate-50 rounded-xl p-4 border border-slate-200/80">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-slate-600 font-medium">Model Confidence</span>
            <span className={`text-sm font-bold font-mono ${
              isFake ? 'text-rose-700' : 'text-emerald-700'
            }`}>
              {confidencePercent}%
            </span>
          </div>

          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                isFake ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
            <span>50% Baseline</span>
            <span>75%</span>
            <span>100% High Certainty</span>
          </div>
        </div>

        {/* Right: Class Probability Breakdown */}
        <div className="md:col-span-3 bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
          <div className="text-[11px] font-semibold text-slate-600 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <BarChart2 className="w-3.5 h-3.5 text-slate-500" />
              Class Probabilities
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div>
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-slate-600">REAL:</span>
                <span className="font-semibold text-emerald-700">{realProbPercent}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${realProbPercent}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-slate-600">FAKE:</span>
                <span className="font-semibold text-rose-700">{fakeProbPercent}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${fakeProbPercent}%` }} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Influential Tokens Detected */}
      {result.ml_details?.top_keywords && result.ml_details.top_keywords.length > 0 && (
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            Influential Vocabulary Tokens:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {result.ml_details.top_keywords.map((kw, i) => (
              <span
                key={i}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-mono"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
