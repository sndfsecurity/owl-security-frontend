
"use client";

import type { TypingLanguage } from "@/lib/transliteration";

interface Props {
  language: TypingLanguage;
  onChange: (language: TypingLanguage) => void;
}

export default function TypingLanguageSelector({
  language,
  onChange,
}: Props) {
  const options: {
    value: TypingLanguage;
    label: string;
  }[] = [
    { value: "en", label: "EN" },
    { value: "hi", label: "हिं" },
    { value: "mr", label: "मर" },
  ];

  return (
    <div className="flex items-center gap-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-md px-3 py-1.5 text-sm font-semibold ${
            language === option.value
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
