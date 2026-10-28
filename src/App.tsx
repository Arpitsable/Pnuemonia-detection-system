import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Upload from '@/pages/Upload';
import Comparison from '@/pages/Comparison';
import About from '@/pages/About';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <Compass className="h-8 w-8" />
      </span>
      <h1 className="mt-6 text-3xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-600">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6">Back to home</Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/comparison" element={<Comparison />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
