import PageHeader from '@/components/PageHeader';
import ComparisonTable from '@/components/ComparisonTable';
import BarChart from '@/components/BarChart';
import ModelCard from '@/components/ModelCard';
import MetricCard from '@/components/MetricCard';
import { models } from '@/data/models';
import { Lightbulb, TrendingUp } from 'lucide-react';

const chartMetrics = [
  { metric: 'accuracy', label: 'Accuracy' },
  { metric: 'precision', label: 'Precision' },
  { metric: 'recall', label: 'Recall' },
  { metric: 'f1Score', label: 'F1-Score' },
  { metric: 'rocAuc', label: 'ROC-AUC' },
] as const;

export default function Comparison() {
  const resnet = models.find((m) => m.key === 'resnet')!;

  return (
    <div>
      <PageHeader
        eyebrow="Benchmark"
        title="Model Comparison Dashboard"
        subtitle="Side-by-side performance of VGGNet, GoogLeNet, and ResNet on the chest X-ray pneumonia dataset."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {/* Headline metric cards */}
        <section>
          <h2 className="mb-5 text-lg font-semibold text-slate-900">Top-line metrics</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Best accuracy" value={resnet.metrics.accuracy} suffix="%" accent="blue" hint="ResNet" />
            <MetricCard label="Best recall" value={resnet.metrics.recall} suffix="%" accent="teal" hint="ResNet — fewest missed cases" />
            <MetricCard label="Best ROC-AUC" value={resnet.metrics.rocAuc} suffix="%" accent="blue" hint="ResNet" />
            <MetricCard label="Fastest training" value="9 min" accent="teal" hint="GoogLeNet" />
          </div>
        </section>

        {/* Table */}
        <section>
          <h2 className="mb-5 text-lg font-semibold text-slate-900">Full comparison table</h2>
          <ComparisonTable />
        </section>

        {/* Bar charts */}
        <section>
          <h2 className="mb-1 text-lg font-semibold text-slate-900">Visual comparison</h2>
          <p className="mb-5 text-sm text-slate-500">Bars are sorted best-to-worst within each metric.</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {chartMetrics.map((c) => (
              <BarChart key={c.metric} metric={c.metric} label={c.label} />
            ))}
          </div>
        </section>

        {/* Insight */}
        <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-teal-50 p-7">
          <div className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
              <Lightbulb className="h-6 w-6" />
            </span>
            <div>
              <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                <TrendingUp className="h-4 w-4 text-teal-600" /> Key insight
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                ResNet achieved the highest overall performance, especially in recall
                (96.2%), which is critical for reducing missed pneumonia cases.
                GoogLeNet trained fastest thanks to its efficient inception modules,
                while VGGNet — the simplest baseline — still delivered strong results
                despite its heavier architecture.
              </p>
            </div>
          </div>
        </section>

        {/* Model explanation cards */}
        <section>
          <h2 className="mb-5 text-lg font-semibold text-slate-900">About each model</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {models.map((m) => (
              <ModelCard key={m.key} model={m} compact />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
