import { Link } from 'react-router-dom';
import {
  Activity,
  UploadCloud,
  ScanLine,
  BarChart3,
  ArrowRight,
  ShieldPlus,
  Stethoscope,
} from 'lucide-react';

const steps = [
  {
    icon: UploadCloud,
    title: 'Upload a chest X-ray image',
    desc: 'Drag and drop a JPG or PNG of a chest X-ray. Your image stays in your browser.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: ScanLine,
    title: 'Select a deep learning model',
    desc: 'Choose between VGGNet, GoogLeNet, and ResNet to run the analysis.',
    color: 'from-teal-500 to-teal-600',
  },
  {
    icon: BarChart3,
    title: 'View prediction & confidence',
    desc: 'Get an instant prediction with a confidence score and risk indicator.',
    color: 'from-indigo-500 to-indigo-600',
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/40 to-slate-50">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="absolute top-40 -left-24 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700">
                <Stethoscope className="h-3.5 w-3.5" />
                Deep Learning · Medical Imaging Research
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Pneumonia Detection
                <span className="block bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                  from Chest X-Rays
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
                A comparative deep learning system using VGGNet, GoogLeNet, and ResNet
                to detect pneumonia from chest X-ray images.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/upload" className="btn-primary">
                  <UploadCloud className="h-4 w-4" />
                  Upload X-Ray
                </Link>
                <Link to="/comparison" className="btn-secondary">
                  <BarChart3 className="h-4 w-4" />
                  View Model Comparison
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldPlus className="h-4 w-4 text-teal-600" />
                  Frontend-only demo
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  3 models compared
                </div>
              </div>
            </div>

            {/* Illustration */}
            <div className="relative animate-fade-in-up [animation-delay:120ms]">
              <div className="relative mx-auto max-w-md">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600/20 to-teal-500/20 blur-2xl" />
                <div className="relative card overflow-hidden p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <Activity className="h-5 w-5 text-blue-500" />
                  </div>

                  {/* Stylized X-ray */}
                  <div className="mt-5 aspect-square rounded-2xl bg-slate-900 p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(255,255,255,0.15),transparent_60%)]" />
                    <svg viewBox="0 0 200 200" className="relative h-full w-full">
                      {/* Ribcage suggestion */}
                      <g stroke="rgba(255,255,255,0.25)" strokeWidth="2" fill="none">
                        <path d="M40 70 Q100 50 160 70" />
                        <path d="M35 90 Q100 70 165 90" />
                        <path d="M32 110 Q100 90 168 110" />
                        <path d="M35 130 Q100 115 165 130" />
                      </g>
                      {/* Spine */}
                      <line x1="100" y1="40" x2="100" y2="170" stroke="rgba(255,255,255,0.35)" strokeWidth="3" />
                      {/* Heart shadow */}
                      <ellipse cx="85" cy="120" rx="22" ry="28" fill="rgba(255,255,255,0.12)" />
                      {/* Pneumonia opacity highlight */}
                      <ellipse cx="125" cy="110" rx="18" ry="22" fill="rgba(96,165,250,0.35)" stroke="rgba(96,165,250,0.8)" strokeWidth="1.5" />
                    </svg>
                    <div className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-1 text-[10px] font-medium text-white backdrop-blur">
                      chest_xray_01.jpg
                    </div>
                  </div>

                  {/* Mini result */}
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-red-50 px-4 py-3">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wide text-red-500">Prediction</p>
                      <p className="text-sm font-bold text-red-700">Pneumonia Detected</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Confidence</p>
                      <p className="text-sm font-bold text-slate-800">92.4%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">How it works</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Three simple steps</h2>
          <p className="mt-3 text-slate-600 max-w-xl mx-auto">
            From upload to prediction in seconds — no setup, no backend required for this demo.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="card card-hover relative p-7">
              <span className="absolute right-5 top-5 text-5xl font-extrabold text-slate-100 select-none">
                {i + 1}
              </span>
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow-md`}>
                <s.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link to="/upload" className="btn-primary">
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
