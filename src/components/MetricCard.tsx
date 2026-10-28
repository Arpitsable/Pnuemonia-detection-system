interface MetricCardProps {
  label: string;
  value: number | string;
  suffix?: string;
  accent?: 'blue' | 'teal' | 'slate';
  hint?: string;
}

const accentMap = {
  blue: 'text-blue-600',
  teal: 'text-teal-600',
  slate: 'text-slate-800',
};

export default function MetricCard({ label, value, suffix, accent = 'slate', hint }: MetricCardProps) {
  return (
    <div className="card card-hover p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${accentMap[accent]}`}>
        {value}
        {suffix && <span className="ml-0.5 text-lg font-semibold">{suffix}</span>}
      </p>
      {hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
