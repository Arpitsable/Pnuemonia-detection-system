import type { ModelInfo } from '@/data/models';
import { BarChart3, Clock, Layers } from 'lucide-react';

interface ModelCardProps {
  model: ModelInfo;
  selected?: boolean;
  onSelect?: () => void;
  compact?: boolean;
}

export default function ModelCard({ model, selected, onSelect, compact }: ModelCardProps) {
  if (compact) {
    return (
      <div className="card card-hover p-5">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white text-xs font-bold"
            style={{ backgroundColor: model.color }}
          >
            {model.name.slice(0, 2)}
          </span>
          <div>
            <h3 className="font-semibold text-slate-900">{model.name}</h3>
            <p className="text-xs text-slate-500">{model.fullName}</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">{model.description}</p>
        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <BarChart3 className="h-3.5 w-3.5" /> {model.metrics.accuracy}% acc
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {model.metrics.trainingTime}
          </span>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group relative w-full overflow-hidden rounded-2xl border bg-white p-5 text-left transition-all duration-200 ${
        selected
          ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg shadow-blue-500/10'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      <div
        className="absolute inset-y-0 left-0 w-1 transition-all"
        style={{ backgroundColor: model.color, opacity: selected ? 1 : 0.4 }}
      />
      <div className="flex items-center gap-3">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-xl text-white text-sm font-bold shadow-sm"
          style={{ backgroundColor: model.color }}
        >
          {model.name.slice(0, 2)}
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900 truncate">{model.name}</h3>
          <p className="text-xs text-slate-500 truncate">{model.fullName}</p>
        </div>
        {selected && (
          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold">
            ✓
          </span>
        )}
      </div>
      {!compact && (
        <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-2">
          {model.description}
        </p>
      )}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Layers className="h-3.5 w-3.5" />
          <span>{model.metrics.accuracy}% accuracy</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <Clock className="h-3.5 w-3.5" />
          <span>{model.metrics.trainingTime} train</span>
        </div>
      </div>
    </button>
  );
}
