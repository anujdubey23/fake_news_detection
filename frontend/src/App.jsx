import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import PredictionCard from './components/PredictionCard';
import GeminiExplanation from './components/GeminiExplanation';
import ArchitecturePipeline from './components/ArchitecturePipeline';
import MetricsModal from './components/MetricsModal';
import Disclaimer from './components/Disclaimer';
import { checkHealth, analyzeNews } from './services/api';
import { Sparkles, Shield, Cpu, ExternalLink, CheckCircle, Search, HelpCircle } from 'lucide-react';

export default function App() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState(null);
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);

  // Check health and metrics on initial mount
  useEffect(() => {
    async function initHealth() {
      try {
        const data = await checkHealth();
        setBackendStatus(data);
      } catch (err) {
        console.warn('Backend currently offline or starting up:', err);
        setBackendStatus({ status: 'offline', error: err.message });
      }
    }
    initHealth();
  }, []);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please paste or type a news article headline or text to analyze.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await analyzeNews(text);
      setResult(data);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(
        err.message ||
        'Unable to connect to NewsLens backend. Please ensure the Flask server is running.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <Header
        backendStatus={backendStatus}
        onOpenMetrics={() => setIsMetricsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dual-Engine Architecture: Classical ML + Generative AI</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Verify Truth in Media with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">NewsLens AI</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Classifies headlines & articles using a calibrated TF-IDF and Logistic Regression ML model, then employs Google Gemini GenAI to provide objective claim analysis and independent fact-checking roadmaps.
          </p>
        </section>

        {/* Input Card */}
        <InputSection
          text={text}
          setText={setText}
          onAnalyze={handleAnalyze}
          onClear={handleClear}
          isLoading={isLoading}
          error={error}
        />

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 space-y-5 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                <div className="h-3 bg-slate-800 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-2 bg-slate-800 rounded-full"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="h-28 bg-slate-800 rounded-xl"></div>
              <div className="h-28 bg-slate-800 rounded-xl"></div>
            </div>
          </div>
        )}

        {/* Results Area */}
        {result && !isLoading && (
          <div className="space-y-6 animate-fadeIn">
            {/* 1. ML Classification Prediction */}
            <PredictionCard result={result} />

            {/* 2. Google Gemini GenAI Explanation */}
            <GeminiExplanation result={result} />

            {/* 3. Pipeline & Token Inspection */}
            <ArchitecturePipeline result={result} />
          </div>
        )}

        {/* Empty State Welcome Guide */}
        {!result && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Statistical ML Classifier</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Uses sublinear TF-IDF vectorization with unigram and bigram n-grams paired with an L2-regularized Logistic Regression model for reliable binary probability estimation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Generative AI Reasoning</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Google Gemini API digests the article to isolate factual claims and unpack suspicious linguistic patterns without overriding the statistical ML decision.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-3">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Actionable Fact-Checking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generates interactive verification steps directing readers toward authoritative wires, peer-reviewed journals, and public registries.
              </p>
            </div>

          </div>
        )}

        {/* Disclaimer Footer */}
        <Disclaimer />

      </main>

      {/* Model Metrics Modal */}
      <MetricsModal
        isOpen={isMetricsOpen}
        onClose={() => setIsMetricsOpen(false)}
        metricsData={backendStatus}
      />
    </div>
  );
}
