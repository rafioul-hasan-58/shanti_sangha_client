"use client";

import { useEffect, useRef } from "react";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  shakeKey?: number;
  disabled?: boolean;
  ariaLabelPrefix?: string;
}

/** Multi-box numeric OTP input with paste, keyboard nav, and error shake support. */
export default function OtpInput({
  length = 5,
  value,
  onChange,
  hasError = false,
  shakeKey = 0,
  disabled = false,
  ariaLabelPrefix = "OTP digit",
}: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, idx) => value[idx] || "");

  useEffect(() => {
    if (shakeKey > 0) {
      inputRefs.current[0]?.focus();
    }
  }, [shakeKey]);

  const updateAt = (index: number, nextChar: string) => {
    const arr = Array.from({ length }, (_, i) => value[i] || "");
    arr[index] = nextChar;
    onChange(arr.join("").slice(0, length));
  };

  const handleInputChange = (index: number, raw: string) => {
    const cleaned = raw.replace(/\D/g, "");
    if (!cleaned) {
      updateAt(index, "");
      return;
    }

    if (cleaned.length > 1) {
      if (digits[index] && cleaned.length === 2) {
        const nextDigit = cleaned[0] === digits[index] ? cleaned[1] : cleaned[0];
        updateAt(index, nextDigit);
        if (index < length - 1) inputRefs.current[index + 1]?.focus();
        return;
      }
      const merged = Array.from({ length }, (_, i) => value[i] || "");
      for (let offset = 0; offset < cleaned.length && index + offset < length; offset++) {
        merged[index + offset] = cleaned[offset];
      }
      onChange(merged.join(""));
      const nextFocus = Math.min(index + cleaned.length, length - 1);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    updateAt(index, cleaned);
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        updateAt(index, "");
      } else if (index > 0) {
        updateAt(index - 1, "");
        inputRefs.current[index - 1]?.focus();
      }
      e.preventDefault();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted);
    inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div
      key={shakeKey}
      className={`flex items-center justify-center gap-2 sm:gap-3 ${
        shakeKey > 0 ? "animate-otp-shake" : ""
      }`}
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          aria-label={`${ariaLabelPrefix} ${index + 1}`}
          maxLength={length}
          disabled={disabled}
          value={digit}
          autoFocus={index === 0}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.currentTarget.select()}
          className={`w-11 h-12 sm:w-12 sm:h-13 rounded-xl border-2 text-center text-lg sm:text-xl font-extrabold transition-all duration-150 outline-none ${
            hasError
              ? "border-red-400 bg-red-50/70 text-red-600 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : digit
                ? "border-[#006a4e] bg-brand-50/60 text-[#006a4e] shadow-xs focus:border-[#00a67e] focus:bg-white focus:ring-2 focus:ring-[#00a67e]/30 focus:scale-[1.04]"
                : "border-gray-200 bg-[#f7f4ea]/50 text-[#12231d] focus:border-[#00a67e] focus:bg-white focus:ring-2 focus:ring-[#00a67e]/30 focus:scale-[1.04]"
          } disabled:opacity-60`}
        />
      ))}
    </div>
  );
}
