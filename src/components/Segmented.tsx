"use client";

/** কাচের মতো পিল-আকারের বাছাই বাটন (যেমন সামনে | পেছনে)। */
export function Segmented<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { id: T; label: string }[]; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="glass-card flex gap-0.5 rounded-full p-1 text-sm font-bold">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={`h-9 rounded-full px-3.5 transition ${value === o.id ? "bg-ink text-cream" : "hover:bg-white"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
