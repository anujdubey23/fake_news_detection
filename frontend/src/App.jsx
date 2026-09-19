import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import PredictionCard from './components/PredictionCard';
import GeminiExplanation from './components/GeminiExplanation';
import ArchitecturePipeline from './components/ArchitecturePipeline';
import MetricsModal from './components/MetricsModal';
import Disclaimer from './components/Disclaimer';
import { checkHealth, analyzeNews } from './services/api';
import { Cpu, Bot, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function App() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState(null);
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);

  useEffect(() => {
    async function initHealth() {
      try {
        const data = await checkHealth();
        setBackendStatus(data);
      } catch (err) {
        console.warn('Backend offline or starting up:', err);
        setBackendStatus({ status: 'offline', error: err.message });
      }
    }
    initHealth();
  }, []);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please paste or enter news text or a headline to evaluate.');
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
        'Unable to reach backend service. Verify server connection.'
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Editorial Navigation */}
      <Header
        backendStatus={backendStatus}
        onOpenMetrics={() => setIsMetricsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        
        {/* Editorial Headline */}
        <section className="text-center max-w-2xl mx-auto space-y-2 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
            <span>Dual-Engine Verification System</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-serif-headline">
            Media Credibility & Claim Verification
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
            Combines TF-IDF and Logistic Regression for classification with Google Gemini GenAI for objective claim extraction and independent fact-checking roadmaps.
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
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 animate-pulse shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100"></div>
              <div className="space-y-1.5 flex-1">
                <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                <div className="h-3 bg-slate-100 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-2 bg-slate-100 rounded-full"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
              <div className="h-24 bg-slate-100 rounded-lg"></div>
              <div className="h-24 bg-slate-100 rounded-lg"></div>
            </div>
          </div>
        )}

        {/* Results Area */}
        {result && !isLoading && (
          <div className="space-y-6">
            <PredictionCard result={result} />
            <GeminiExplanation result={result} />
            <ArchitecturePipeline result={result} />
          </div>
        )}

        {/* Information Cards (Empty State) */}
        {!result && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-2.5">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Statistical Classifier
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sublinear TF-IDF representation (unigrams and bigrams) evaluated with an L2-regularized Logistic Regression classifier for calibrated probability scoring.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-2.5">
                <Bot className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Generative Reasoning
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Google Gemini API generates neutral summaries and decomposes assertions without overriding the statistical ML classification result.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-2.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Fact-Checking Guidance
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Provides actionable, domain-specific steps directing researchers to verify primary sources, public registries, and accredited wire reports.
              </p>
            </div>

          </div>
        )}

        {/* Disclaimer */}
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
