import { Link } from 'react-router-dom';
import { Activity, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-white">
                <Activity className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="text-[15px] font-bold text-slate-900">
                PneumoScan<span className="text-blue-600">AI</span>
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 max-w-xs">
              Pneumonia Detection from Chest X-Rays — a comparative study of
              VGGNet, GoogLeNet, and ResNet.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Navigate</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/" className="text-slate-500 hover:text-blue-600">Home</Link></li>
              <li><Link to="/upload" className="text-slate-500 hover:text-blue-600">Upload X-Ray</Link></li>
              <li><Link to="/comparison" className="text-slate-500 hover:text-blue-600">Model Comparison</Link></li>
              <li><Link to="/about" className="text-slate-500 hover:text-blue-600">About</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Disclaimer</h4>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Built for educational and research purposes only. This tool is
              not a substitute for professional medical diagnosis.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 sm:flex-row">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} PneumoScanAI · Built for educational and research purposes
          </p>
          <p className="flex items-center gap-1.5 text-xs text-slate-400">
            Made with <Heart className="h-3.5 w-3.5 text-red-400 fill-red-400" /> for medical AI research
          </p>
        </div>
      </div>
    </footer>
  );
}
