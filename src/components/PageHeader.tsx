interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ eyebrow, title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="border-b border-slate-100 bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
}
