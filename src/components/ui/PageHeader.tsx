interface PageHeaderProps {
  title: string;
  description: string;
}

export const PageHeader = ({ title, description }: PageHeaderProps) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
    <p className="mt-1 text-sm text-slate-400">{description}</p>
  </div>
);
