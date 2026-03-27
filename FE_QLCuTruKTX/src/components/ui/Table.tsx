import { ReactNode } from "react";

export function Table({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${className}`}>{children}</table>
    </div>
  );
}

export function TableHeader({ children }: { children: ReactNode }) {
  return <thead className="bg-slate-50 border-b border-slate-200">{children}</thead>;
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-slate-200">{children}</tbody>;
}

export function TableRow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <tr className={className}>{children}</tr>;
}

export function TableHead({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <th className={`px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider ${className}`}>
      {children}
    </th>
  );
}

export function TableCell({
  children,
  className = "",
  colSpan
}: {
  children: ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td className={`px-6 py-4 text-sm text-slate-900 ${className}`} colSpan={colSpan}>
      {children}
    </td>
  );
}
