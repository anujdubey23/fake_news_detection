import React, { useState } from 'react';
import { Network, ArrowRight, CheckCircle2, ChevronDown, ChevronUp, Layers, Terminal } from 'lucide-react';

export default function ArchitecturePipeline({ result }) {
  const [showCleaned, setShowCleaned] = useState(false);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">System Architecture & Pipeline</h3>
            <p className="text-xs text-slate-400">
              Clear separation between deterministic ML classification and Generative AI reasoning
            </p>
          </div>
        </div>
      </div>

      {/* Visual Workflow Steps */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
        
        {/* Step 1 */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold">Step 1</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Regex & Clean</span>
            </div>
            <h4 className="text-xs font-semibold text-slate-200 mb-1">Text Normalization</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Lowercasing, URL/HTML removal, punctuation stripping, contraction expansion, and stopword filtering.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
            Output: clean token stream
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold">Step 2</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">TF-IDF</span>
            </div>
            <h4 className="text-xs font-semibold text-slate-200 mb-1">Vectorization</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Converts tokens into sparse term-frequency inverse document frequency matrix with (1, 2) n-grams.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
            Feature space: up to 5,000 dims
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Step 3</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Classification</span>
            </div>
            <h4 className="text-xs font-semibold text-slate-200 mb-1">Logistic Regression</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Computes class probabilities via sigmoid function. Outputs authoritative REAL or FAKE prediction.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
            Output: REAL / FAKE + Score
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase text-purple-400 font-bold">Step 4</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Gemini LLM</span>
            </div>
            <h4 className="text-xs font-semibold text-slate-200 mb-1">AI Explanation</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Analyzes claims, synthesizes neutral summary, explains red flags, and constructs verification steps.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
            Non-overriding guidance layer
          </div>
        </div>

      </div>

      {/* Cleaned text viewer for analyzed sample */}
      {result?.ml_details?.cleaned_text && (
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <button
            onClick={() => setShowCleaned(!showCleaned)}
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{showCleaned ? 'Hide' : 'Inspect'} Preprocessed Text fed to TF-IDF Model</span>
            {showCleaned ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showCleaned && (
            <div className="mt-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 break-words leading-relaxed">
              {result.ml_details.cleaned_text}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
