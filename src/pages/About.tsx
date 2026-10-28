import { Link } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import {
  Target,
  Database,
  Cpu,
  Gauge,
  Rocket,
  UploadCloud,
  ShieldAlert,
  ArrowRight,
  Brain,
  LayoutDashboard,
  Layers,
} from 'lucide-react';

const sections = [
  {
    icon: Target,
    title: 'Objective',
    text: 'Compare three popular convolutional neural network models — VGGNet, GoogLeNet, and ResNet — for detecting pneumonia from chest X-ray images, and identify which architecture offers the best trade-off between accuracy and efficiency.',
  },
  {
    icon: Database,
    title: 'Dataset',
    text: 'Chest X-Ray Images (Pneumonia) — a publicly available dataset containing thousands of pediatric chest X-rays labeled as either “Normal” or “Pneumonia”.',
  },
  {
    icon: Cpu,
    title: 'Models compared',
    text: 'VGG-16, GoogLeNet (Inception v1), and ResNet-50 — three landmark CNN architectures representing different approaches to deep visual feature learning.',
  },
  {
    icon: Gauge,
    title: 'Evaluation metrics',
    text: 'Accuracy, Precision, Recall, F1-Score, and ROC-AUC — together these capture both overall performance and the clinically critical balance between false positives and false negatives.',
  },
];

const futureScope = [
  { icon: Cpu, text: 'Backend model integration for real inference' },
  { icon: Brain, text: 'Grad-CAM explainability heatmaps' },
  { icon: LayoutDashboard, text: 'Doctor dashboard for case review' },
  { icon: Layers, text: 'Multi-disease detection beyond pneumonia' },
];

export default function About() {
  return (
    <div>
      <PageHeader
        eyebrow="About the project"
        title="About PneumoScanAI"
        subtitle="This project compares three popular convolutional neural network models for detecting pneumonia from chest X-ray images."
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {/* Intro / objective summary */}
        <section className="card p-7 sm:p-9">
          <p className="text-base leading-relaxed text-slate-700">
            Pneumonia is a leading cause of mortality worldwide, and early detection
            from chest X-rays can significantly improve patient outcomes. This project
            explores whether modern deep learning architectures — originally designed
            for general image classification — can reliably assist in flagging
            pneumonia from chest radiographs.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-700">
            We benchmark <strong>VGGNet</strong>, <strong>GoogLeNet</strong>, and
            <strong> ResNet</strong> on the same dataset and compare them across
            accuracy, precision, recall, F1-score, and ROC-AUC to understand the
            strengths and trade-offs of each approach.
          </p>
        </section>

        {/* Detail sections */}
        <section className="grid gap-6 sm:grid-cols-2">
          {sections.map((s) => (
            <div key={s.title} className="card card-hover p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <s.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.text}</p>
            </div>
          ))}
        </section>

        {/* Future scope */}
        <section className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50/70 to-blue-50/70 p-7 sm:p-9">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-teal-600 shadow-sm">
              <Rocket className="h-6 w-6" />
            </span>
            <h3 className="text-lg font-semibold text-slate-900">Future scope</h3>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {futureScope.map((f) => (
              <div key={f.text} className="flex items-center gap-3 rounded-xl bg-white/70 px-4 py-3.5">
                <f.icon className="h-5 w-5 shrink-0 text-teal-600" />
                <span className="text-sm font-medium text-slate-700">{f.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="flex gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <ShieldAlert className="h-6 w-6 shrink-0 text-amber-600" />
          <div>
            <h3 className="text-sm font-semibold text-amber-800">Educational project</h3>
            <p className="mt-1 text-sm leading-relaxed text-amber-700">
              This is an educational and research project. It is not intended to
              diagnose, treat, cure, or prevent any disease, and is not a substitute
              for professional medical advice, diagnosis, or treatment.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="flex flex-col items-center gap-4 rounded-2xl bg-slate-900 p-8 text-center">
          <h3 className="text-xl font-bold text-white">Ready to try the demo?</h3>
          <p className="max-w-md text-sm text-slate-300">
            Upload a chest X-ray and see how each model performs — all in your browser.
          </p>
          <Link to="/upload" className="btn-primary">
            <UploadCloud className="h-4 w-4" /> Upload an X-Ray <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
