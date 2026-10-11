const paths: Record<string, React.ReactNode> = {
  "kids-fashion": <path d="M8 3l-5 3 2 4 2-1v12h10V9l2 1 2-4-5-3a4 4 0 0 1-8 0z" />,
  "women-fashion": <path d="M9 3h6l-1 4 4 14H6l4-14z M9 3c0 2 6 2 6 0" />,
  "men-fashion": <path d="M8 3l4 3 4-3 4 3-2 4-2-1v12H8V9l-2 1-2-4z M12 6v15" />,
  toys: <><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0z" /><circle cx="8" cy="5" r="2" /><circle cx="16" cy="5" r="2" /></>,
  "beauty-care": <path d="M9 10h6v11H9z M10 10V6h4v4 M11 6V3h2v3" />,
  "home-kitchen": <path d="M4 11l8-7 8 7v9H4z M10 20v-5h4v5" />,
  grocery: <path d="M4 7h16l-2 13H6z M9 7a3 3 0 0 1 6 0" />,
  gadgets: <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></>,
};

export function CategoryIcon({ slug, size = 30 }: { slug: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[slug] ?? <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M9 12h6" /></>}
    </svg>
  );
}
