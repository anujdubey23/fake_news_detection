import React from 'react';
import { ShieldCheck, ShieldAlert, Cpu, BarChart2, CheckCircle, HelpCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export default function PredictionCard({ result }) {
  if (!result) return null;

  const isFake = result.prediction === 'FAKE';
  const confidencePercent = (result.confidence * 100).toFixed(1);
  const realProbPercent = ((result.probabilities?.real ?? 0.5) * 100).toFixed(1);
  const fakeProbPercent = ((result.probabilities?.fake ?? 0.5) * 100).toFixed(1);

  const chartData = [
    { name: 'REAL', probability: parseFloat(realProbPercent), color: '#10b981' },
    { name: 'FAKE', probability: parseFloat(fakeProbPercent), color: '#f43f5e' }
  ];

  return (
    <div className={`rounded-2xl border p-6 transition-all shadow-xl backdrop-blur-sm ${
      isFake
        ? 'bg-gradient-to-b from-rose-950/40 via-slate-900 to-slate-900 border-rose-800/60 shadow-rose-950/30'
        : 'bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-800/60 shadow-emerald-950/30'
    }`}>
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Machine Learning Classification Result
          </span>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
          TF-IDF + Logistic Regression
        </span>
      </div>

      {/* Main Result Hero */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left: Big Label + Confidence Badge */}
        <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-3 rounded-2xl ${
              isFake ? 'bg-rose-500/20 text-rose-400 ring-2 ring-rose-500/40' : 'bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/40'
            }`}>
              {isFake ? <ShieldAlert className="w-10 h-10" /> : <ShieldCheck className="w-10 h-10" />}
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Determined Classification
              </span>
              <h2 className={`text-4xl font-extrabold tracking-tight ${
                isFake ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {result.prediction}
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            {isFake
              ? 'Model detected sensationalist linguistic patterns, exaggerated assertions, or trigger n-grams.'
              : 'Model identified neutral journalistic vocabulary and institutional phrasing.'}
          </p>
        </div>

        {/* Middle: Confidence Bar & Level */}
        <div className="md:col-span-4 bg-slate-950/60 rounded-xl p-4 border border-slate-800/80">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-slate-400 font-medium">Model Confidence</span>
            <span className={`text-sm font-bold font-mono ${
              isFake ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {confidencePercent}%
            </span>
          </div>

          {/* Visual Bar */}
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                isFake
                  ? 'bg-gradient-to-r from-rose-600 to-rose-400'
                  : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
              }`}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-500">
            <span>50% (Uncertain)</span>
            <span>75%</span>
            <span>100% (High Certainty)</span>
          </div>
        </div>

        {/* Right: Class Probability Breakdown Chart */}
        <div className="md:col-span-3 bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
          <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <BarChart2 className="w-3 h-3 text-indigo-400" />
              Class Probabilities
            </span>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="text-emerald-400 font-medium">Real:</span>
              <span className="text-slate-300">{realProbPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${realProbPercent}%` }} />
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-rose-400 font-medium">Fake:</span>
              <span className="text-slate-300">{fakeProbPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: `${fakeProbPercent}%` }} />
            </div>
          </div>
        </div>

      </div>

      {/* Influential Tokens Detected */}
      {result.ml_details?.top_keywords && result.ml_details.top_keywords.length > 0 && (
        <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
            Influential Vocabulary Tokens:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {result.ml_details.top_keywords.map((kw, i) => (
              <span
                key={i}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/90 text-indigo-300 border border-slate-700 font-mono"
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
