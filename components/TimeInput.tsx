
"use client";

import { useEffect, useState } from "react";

type TimeInputProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export default function TimeInput({
  value,
  onChange,
  className = "",
}: TimeInputProps) {
  const [time, setTime] = useState(value);

  useEffect(() => {
    setTime(value);
  }, [value]);

  const handleTextChange = (input: string) => {
    const digits = input.replace(/\D/g, "").slice(0, 6);

    let formatted = digits;

    if (digits.length > 4) {
      formatted =
        digits.slice(0, 2) +
        ":" +
        digits.slice(2, 4) +
        ":" +
        digits.slice(4);
    } else if (digits.length > 2) {
      formatted = digits.slice(0, 2) + ":" + digits.slice(2);
    }

    setTime(formatted);
    onChange(formatted);
  };

  const validTime =
    /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(value)
      ? value
      : "";

  return (
    <div className="relative w-full">
      <input
        type="text"
        inputMode="numeric"
        value={time}
        placeholder="HH:MM:SS"
        onChange={(e) => handleTextChange(e.target.value)}
        className={`w-full pr-12 ${className}`}
      />

      <input
        type="time"
        step="1"
        value={validTime}
        onChange={(e) => {
          setTime(e.target.value);
          onChange(e.target.value);
        }}
        className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 cursor-pointer opacity-0"
        aria-label="Select time"
      />

      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600">
        ◷
      </span>
    </div>
  );
}
