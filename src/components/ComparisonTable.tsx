import { models } from '@/data/models';
import { Trophy } from 'lucide-react';

const columns = [
  { key: 'accuracy', label: 'Accuracy', suffix: '%' },
  { key: 'precision', label: 'Precision', suffix: '%' },
  { key: 'recall', label: 'Recall', suffix: '%' },
  { key: 'f1Score', label: 'F1-Score', suffix: '%' },
  { key: 'rocAuc', label: 'ROC-AUC', suffix: '%' },
  { key: 'trainingTime', label: 'Training Time', suffix: '' },
] as const;

function bestKey(key: (typeof columns)[number]['key']): string | null {
  if (key === 'trainingTime') {
    return models.reduce((min, m) => (m.metrics.trainingMinutes < min.metrics.trainingMinutes ? m : min)).name;
  }
  let best = models[0];
  for (const m of models) {
    if ((m.metrics[key as keyof typeof m.metrics] as number) > (best.metrics[key as keyof typeof best.metrics] as number)) best = m;
  }
  return best.name;
}

export default function ComparisonTable() {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-left">
              <th className="px-5 py-4 font-semibold text-slate-700">Model</th>
              {columns.map((c) => (
                <th key={c.key} className="px-5 py-4 font-semibold text-slate-700 whitespace-nowrap">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {models.map((m) => (
              <tr key={m.key} className="transition-colors hover:bg-slate-50/60">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-[11px] font-bold"
                      style={{ backgroundColor: m.color }}
                    >
                      {m.name.slice(0, 2)}
                    </span>
                    <span className="font-semibold text-slate-800">{m.name}</span>
                  </div>
                </td>
                {columns.map((c) => {
                  const val = m.metrics[c.key as keyof typeof m.metrics];
                  const isBest = bestKey(c.key) === m.name;
                  return (
                    <td key={c.key} className="px-5 py-4 whitespace-nowrap">
                      <span className={`font-medium ${isBest ? 'text-blue-700' : 'text-slate-600'}`}>
                        {val}{c.suffix}
                      </span>
                      {isBest && (
                        <Trophy className="ml-1.5 inline h-3.5 w-3.5 text-amber-500" aria-label="best" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
