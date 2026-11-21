interface PageHeaderProps {
  title: string;
  description: string;
}

export const PageHeader = ({ title, description }: PageHeaderProps) => (
  <div className="mb-8">
    <h2 className="font-display text-4xl font-bold leading-none tracking-tight sm:text-5xl">
      {title}
    </h2>
    <p className="mt-3 max-w-prose text-ink-soft">{description}</p>
  </div>
);
