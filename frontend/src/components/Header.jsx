import React from 'react';
import { Newspaper, Brain, Cpu, Github, BarChart3, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Header({ backendStatus, onOpenMetrics }) {
  const isOnline = backendStatus?.status === 'healthy';
  const geminiActive = backendStatus?.gemini_configured;

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo & Branding */}
        <div className="flex items-center space-x-3.5">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/25">
            <Newspaper className="w-6 h-6 text-white" />
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center">
                NewsLens <span className="text-indigo-400 ml-1">AI</span>
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              AI-powered fake news detection & explanation
            </p>
          </div>
        </div>

        {/* Center Capability Badges */}
        <div className="hidden md:flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>TF-IDF + Logistic Regression</span>
          </div>
          <span className="text-slate-600">+</span>
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span>Google Gemini GenAI</span>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-3">
          {/* Metrics Modal Trigger */}
          <button
            onClick={onOpenMetrics}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            title="Inspect trained model evaluation metrics"
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Model Metrics</span>
          </button>

          {/* Backend Health Badge */}
          <div
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isOnline
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
            title={
              isOnline
                ? `Backend online (${geminiActive ? 'Gemini active' : 'Rule fallback active'})`
                : 'Backend unreachable'
            }
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`}
            />
            <span className="hidden sm:inline">
              {isOnline ? (geminiActive ? 'Gemini Live' : 'Backend Ready') : 'Offline'}
            </span>
          </div>

          {/* GitHub Repository Link */}
          <a
            href="https://github.com/anujdubey23/fake_news_detection"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
            title="View on GitHub: anujdubey23/fake_news_detection"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>

      </div>
    </header>
  );
}
