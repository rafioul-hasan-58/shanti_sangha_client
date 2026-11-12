"use client";

import { useState } from "react";

interface PasswordInputFieldProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  showLabel: string;
  hideLabel: string;
  labelClassName: string;
}

/** Password input with built-in show/hide toggle for auth forms. */
export default function PasswordInputField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  showLabel,
  hideLabel,
  labelClassName,
}: PasswordInputFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <label className={labelClassName}>{label}</label>
        {hint && <span className="text-xs text-gray-500 font-medium">{hint}</span>}
      </div>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required
          minLength={6}
          className="w-full h-11 md:h-12 pl-4 pr-16 rounded-xl border border-gray-200 bg-[#f7f4ea]/40 text-[#12231d] text-sm placeholder:text-gray-400 focus:bg-white focus:border-[#00a67e] focus:ring-2 focus:ring-[#00a67e] transition-all outline-none"
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          className="absolute inset-y-0 right-3.5 flex items-center text-xs font-semibold text-[#006a4e] hover:text-[#004d38] cursor-pointer"
          aria-label={visible ? hideLabel : showLabel}
        >
          {visible ? hideLabel : showLabel}
        </button>
      </div>
    </div>
  );
}

