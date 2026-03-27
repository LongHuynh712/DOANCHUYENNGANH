interface PageTitleProps {
  title: string;
}

export function PageTitle({ title }: PageTitleProps) {
  return (
    <h1 className="text-2xl font-semibold mb-4 text-slate-800">
      {title}
    </h1>
  );
}
