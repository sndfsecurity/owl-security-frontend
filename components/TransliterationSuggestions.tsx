
"use client";

interface Props {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export default function TransliterationSuggestions({
  suggestions,
  onSelect,
}: Props) {
  if (suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-blue-50 p-3">
      {suggestions.map((suggestion, index) => (
        <button
          key={`${suggestion}-${index}`}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onSelect(suggestion)}
          className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-blue-100"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
