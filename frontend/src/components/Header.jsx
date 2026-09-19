import React from 'react';
import { Newspaper, ShieldCheck, Github, BarChart3, Radio } from 'lucide-react';

export default function Header({ backendStatus, onOpenMetrics }) {
  const isOnline = backendStatus?.status === 'healthy';
  const geminiActive = backendStatus?.gemini_configured;

  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Identity */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-900 text-white shadow-sm">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-slate-900 font-serif-headline">
                NewsLens
              </span>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium border border-slate-200">
                AI Lab
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Machine Learning & Generative AI Verification Framework
            </p>
          </div>
        </div>

        {/* Center Tag */}
        <div className="hidden md:flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <span>TF-IDF + Logistic Regression</span>
          <span className="text-slate-300">•</span>
          <span>Google Gemini AI</span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3">
          {/* Metrics Modal Trigger */}
          <button
            onClick={onOpenMetrics}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition"
            title="Inspect trained model evaluation metrics"
          >
            <BarChart3 className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Model Evaluation (91.3%)</span>
          </button>

          {/* Backend Status */}
          <div
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isOnline
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOnline ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
            <span className="hidden sm:inline font-mono text-[11px]">
              {isOnline ? (geminiActive ? 'Live (Gemini)' : 'Backend Connected') : 'Offline'}
            </span>
          </div>

          {/* GitHub Repo */}
          <a
            href="https://github.com/anujdubey23/fake_news_detection"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition"
            title="View GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>

      </div>
    </header>
  );
}
