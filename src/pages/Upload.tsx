import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UploadBox from '@/components/UploadBox';
import ModelCard from '@/components/ModelCard';
import ResultCard from '@/components/ResultCard';
import PageHeader from '@/components/PageHeader';
import { models, type ModelKey, getModelByKey } from '@/data/models';
import {
  predictXRay,
  simulatePrediction,
  resolveApiBase,
  type PredictionResult,
} from '@/data/mockPredict';
import { Sparkles, BarChart3, CheckCircle, AlertCircle, PlayCircle, Loader2 } from 'lucide-react';

type Phase = 'idle' | 'analyzing' | 'done';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelKey>('resnet');
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useDemoMode, setUseDemoMode] = useState<boolean>(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  // Check backend health on mount
  useEffect(() => {
    let active = true;
    const checkHealth = async () => {
      const base = resolveApiBase();
      const urlsToCheck = [
        `${base}/health`,
        base === '/api' ? 'http://127.0.0.1:8000/health' : null,
      ].filter(Boolean) as string[];

      for (const url of urlsToCheck) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000);
          const res = await fetch(url, { signal: controller.signal });
          clearTimeout(timeoutId);
          if (res.ok && active) {
            setBackendOnline(true);
            return;
          }
        } catch {
          // Continue to next check
        }
      }

      if (active) {
        setBackendOnline(false);
      }
    };

    checkHealth();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFile = (selectedFile: File) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setResult(null);
    setError(null);
    setPhase('idle');
  };

  const clear = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setPhase('idle');
  };

  const analyze = async (forceDemo = false) => {
    if (!file || phase === 'analyzing') return;

    const runDemo = forceDemo || useDemoMode;
    setPhase('analyzing');
    setError(null);
    setResult(null);

    const modelInfo = getModelByKey(selectedModel);

    try {
      if (runDemo) {
        const demoResult = await simulatePrediction(
          file,
          selectedModel,
          modelInfo.fullName
        );
        setResult(demoResult);
        setPhase('done');
      } else {
        const realResult = await predictXRay(
          file,
          selectedModel,
          modelInfo.fullName
        );
        setResult(realResult);
        setPhase('done');
      }
    } catch (err) {
      console.error('X-ray prediction failed:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to analyze the X-ray with the backend.'
      );
      setPhase('idle');
    }
  };

  const reset = () => {
    clear();
  };

  return (
    <div>
      <PageHeader
        eyebrow="Analysis"
        title="Upload & Analyze X-Ray"
        subtitle="Upload a chest X-ray and receive a deep learning prediction."
      >
        <div className="flex flex-wrap items-center gap-3">
          {backendOnline === true ? (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2 text-xs font-medium text-emerald-700 border border-emerald-200">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>Backend Connected (DenseNet121)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3.5 py-2 text-xs font-medium text-amber-800 border border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span>
                Backend {backendOnline === null ? 'Checking...' : 'Offline'} • Demo Mode Available
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setUseDemoMode(!useDemoMode)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              useDemoMode
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {useDemoMode ? '⚡ Demo Mode Active' : 'Switch to Demo Mode'}
          </button>
        </div>
      </PageHeader>

      {error && (
        <div className="mx-auto max-w-5xl px-4 pt-4 sm:px-6 lg:px-8">
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">Backend connection failed</p>
                <p className="mt-1">{error}</p>
                <p className="mt-2 text-xs text-red-600">
                  Target API: <code className="bg-red-100 px-1 py-0.5 rounded">{resolveApiBase()}</code>.
                  If hosting on Vercel, deploy your FastAPI backend (e.g. Render / Hugging Face)
                  or use Demo Mode below for instant preview.
                </p>
              </div>
              <button
                type="button"
                onClick={() => analyze(true)}
                className="shrink-0 flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
              >
                <PlayCircle className="h-3.5 w-3.5" />
                Run Demo Mode
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {phase === 'done' && result ? (
          <div className="space-y-6">
            <ResultCard result={result} onReset={reset} />

            <div className="flex justify-center">
              <Link to="/comparison" className="btn-secondary">
                <BarChart3 className="h-4 w-4" />
                Compare models
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-5">
            <div className="space-y-6 lg:col-span-3">
              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  1 · Upload chest X-ray
                </h2>

                <UploadBox
                  onFileSelected={handleFile}
                  previewUrl={previewUrl}
                  fileName={file?.name ?? null}
                  onClear={clear}
                />
              </div>

              {file && (
                <div className="flex flex-col gap-3 rounded-xl bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-slate-600">
                    Ready to analyze{' '}
                    <span className="font-semibold text-slate-800">
                      {file.name}
                    </span>
                    {useDemoMode && (
                      <span className="ml-2 inline-block rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                        Demo Mode
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => analyze(false)}
                    disabled={phase === 'analyzing'}
                    className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {phase === 'analyzing' ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Analyzing…
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Analyze X-Ray
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                2 · Choose a model
              </h2>

              <div className="space-y-3">
                {models.map((model) => (
                  <ModelCard
                    key={model.key}
                    model={model}
                    selected={selectedModel === model.key}
                    onSelect={() => {
                      setSelectedModel(model.key);
                      setError(null);
                    }}
                  />
                ))}
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-500">
                The trained backend utilizes DenseNet121 with transfer learning.
                Comparison metrics for VGGNet and GoogLeNet are based on our benchmark experiments.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
