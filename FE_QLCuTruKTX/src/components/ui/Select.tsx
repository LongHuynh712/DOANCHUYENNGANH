import React from "react";

type Option = { value: string; label: string };

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  name?: string;
  options: Option[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function Select({
  label,
  name,
  options,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        name={name}
        className={
          "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 " +
          className
        }
        {...props} // cho phép value, onChange,...
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
