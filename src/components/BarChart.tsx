import { models } from '@/data/models';

interface BarChartProps {
  metric: 'accuracy' | 'precision' | 'recall' | 'f1Score' | 'rocAuc';
  label: string;
}

export default function BarChart({ metric, label }: BarChartProps) {
  const max = 100;
  const sorted = [...models].sort((a, b) => b.metrics[metric] - a.metrics[metric]);

  return (
    <div className="card p-5">
      <div className="flex items-baseline justify-between">
        <h4 className="text-sm font-semibold text-slate-700">{label}</h4>
        <span className="text-xs text-slate-400">%</span>
      </div>
      <div className="mt-4 space-y-3">
        {sorted.map((m) => {
          const value = m.metrics[metric];
          const width = (value / max) * 100;
          return (
            <div key={m.key}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">{m.name}</span>
                <span className="font-semibold text-slate-800">{value}%</span>
              </div>
              <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full animate-grow-bar transition-all duration-700"
                  style={{ width: `${width}%`, backgroundColor: m.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
