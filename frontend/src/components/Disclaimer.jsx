import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function Disclaimer() {
  return (
    <footer className="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 space-y-2">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs shadow-sm">
        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
        <span>
          <strong>Advisory Disclaimer:</strong> This prediction is AI-generated and should not be treated as definitive fact-checking.
        </span>
      </div>

      <p className="text-[11px] text-slate-500 max-w-2xl mx-auto leading-relaxed">
        NewsLens combines statistical machine learning with Generative AI guidance to flag suspicious linguistic patterns and outline verification roadmaps. Always independently corroborate claims with primary sources, official wire services, and peer-reviewed documentation.
      </p>

      <div className="text-[11px] text-slate-400">
        B.Tech Computer Science & Engineering (AI/ML) Project • GitHub: <a href="https://github.com/anujdubey23/fake_news_detection" target="_blank" rel="noreferrer" className="text-slate-700 underline font-medium">anujdubey23/fake_news_detection</a>
      </div>
    </footer>
  );
}
