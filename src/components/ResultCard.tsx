import type { PredictionResult } from '@/data/mockPredict';
import {
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  Clock,
  Cpu,
  FileImage,
} from 'lucide-react';

interface ResultCardProps {
  result: PredictionResult;
  onReset: () => void;
}

export default function ResultCard({ result, onReset }: ResultCardProps) {
  // Use the actual prediction label to determine the displayed class.
  const prediction = String(result.prediction ?? '').toUpperCase();
  const pneumonia =
    result.isPneumonia ??
    prediction.includes('PNEUMONIA');

  const accent = pneumonia
    ? {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-700',
        bar: 'bg-red-500',
        ring: 'text-red-600',
      }
    : {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-700',
        bar: 'bg-emerald-500',
        ring: 'text-emerald-600',
      };

  const displayedPrediction = pneumonia ? 'PNEUMONIA' : 'NORMAL';

  const confidence = Math.min(
    100,
    Math.max(0, Number(result.confidence) || 0),
  );

  return (
    <div className="animate-fade-in-up card overflow-hidden">
      {/* Make the predicted class the main focus */}
      <div
        className={`flex items-start gap-4 ${accent.bg} ${accent.border} border-b px-6 py-6`}
      >
        <span
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${accent.text} bg-white shadow-sm`}
        >
          {pneumonia ? (
            <AlertTriangle className="h-7 w-7" />
          ) : (
            <CheckCircle2 className="h-7 w-7" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Model prediction
          </p>

          <h2
            className={`mt-1 text-3xl font-extrabold tracking-tight ${accent.text}`}
          >
            {displayedPrediction}
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {pneumonia
              ? 'The model classified this X-ray as the PNEUMONIA class.'
              : 'The model classified this X-ray as the NORMAL class.'}
          </p>
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Model confidence
            </p>
            <p className={`mt-1 text-3xl font-bold ${accent.ring}`}>
              {confidence.toFixed(2)}%
            </p>
          </div>

          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${accent.bg} ${accent.text}`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            {pneumonia ? 'Pneumonia predicted' : 'Normal predicted'}
          </span>
        </div>

        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${accent.bar} transition-all duration-700`}
            style={{ width: `${confidence}%` }}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-3.5">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Cpu className="h-3.5 w-3.5" />
              Model used
            </div>
            <p className="mt-1 break-words text-sm font-semibold text-slate-800">
              {result.modelName || 'DenseNet121'}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <FileImage className="h-3.5 w-3.5" />
              File
            </div>
            <p className="mt-1 truncate text-sm font-semibold text-slate-800">
              {result.fileName || 'Uploaded X-ray'}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="h-3.5 w-3.5" />
              Uploaded
            </div>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {result.uploadedAt || 'Just now'}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button onClick={onReset} className="btn-primary flex-1 w-full">
            <RotateCcw className="h-4 w-4" />
            Try Another X-Ray
          </button>
        </div>

        <p className="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-700">
          Experimental AI output for educational and research purposes only.
          This prediction is not a medical diagnosis and must not replace
          assessment by a qualified healthcare professional.
        </p>
      </div>
    </div>
  );
}