import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp, Terminal } from 'lucide-react';

export default function ArchitecturePipeline({ result }) {
  const [showCleaned, setShowCleaned] = useState(false);

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-5">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">System Architecture & Pipeline</h3>
            <p className="text-xs text-slate-500">
              Clear separation between statistical machine learning and generative reasoning
            </p>
          </div>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        
        {/* Step 1 */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Step 01</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-mono">Regex</span>
            </div>
            <h4 className="text-xs font-semibold text-slate-900 mb-1">Text Normalization</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              HTML/URL removal, contraction expansion, lowercase, and stopword filtering.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-400 font-mono">
            Output: clean tokens
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Step 02</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-mono">TF-IDF</span>
            </div>
            <h4 className="text-xs font-semibold text-slate-900 mb-1">Sparse Vectorization</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Unigrams and bigrams mapped to 5,000 feature dimensions using sublinear scaling.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-400 font-mono">
            Output: sparse vector
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase">Step 03</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">ML Model</span>
            </div>
            <h4 className="text-xs font-semibold text-slate-900 mb-1">Logistic Regression</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Computes calibrated probabilities via sigmoid function. Outputs authoritative label.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-400 font-mono">
            Output: REAL / FAKE
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold text-blue-700 uppercase">Step 04</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono">LLM</span>
            </div>
            <h4 className="text-xs font-semibold text-slate-900 mb-1">AI Explanation</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Google Gemini synthesizes neutral summaries, extracts claims, and outlines fact checks.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-400 font-mono">
            Advisory layer only
          </div>
        </div>

      </div>

      {/* Cleaned text viewer */}
      {result?.ml_details?.cleaned_text && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={() => setShowCleaned(!showCleaned)}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium transition"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{showCleaned ? 'Hide' : 'Inspect'} Preprocessed Text Tokens</span>
            {showCleaned ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showCleaned && (
            <div className="mt-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 break-words leading-relaxed">
              {result.ml_details.cleaned_text}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
