import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Disclaimer() {
  return (
    <footer className="mt-12 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500 space-y-2.5">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 text-xs">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <span>
          <strong>Disclaimer:</strong> This prediction is AI-generated and should not be treated as definitive fact-checking.
        </span>
      </div>

      <p className="text-[11px] text-slate-500 max-w-2xl mx-auto leading-relaxed">
        NewsLens AI combines statistical machine learning with Generative AI guidance to flag suspicious linguistic patterns and outline verification steps. Always independently verify critical claims with primary source documentation, verified registries, and reputable global wire services.
      </p>

      <div className="text-[11px] text-slate-600">
        Engineered for Generative AI Academic Evaluation & Placement Portfolio • GitHub: <a href="https://github.com/anujdubey23/fake_news_detection" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">anujdubey23/fake_news_detection</a>
      </div>
    </footer>
  );
}
