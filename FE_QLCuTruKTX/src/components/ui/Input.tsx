import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name?: string;
}

export function Input({ label, name, className = "", ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        name={name}
        className={
          "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 " +
          className
        }
        {...props} // cho phép placeholder, defaultValue, type, min,...
      />
    </div>
  );
}
