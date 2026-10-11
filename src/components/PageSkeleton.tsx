export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 sm:px-6" aria-busy="true" aria-label="লোড হচ্ছে">
      <div className="mb-4 h-4 w-40 rounded bg-sand" />
      <div className="mb-8 h-9 w-72 rounded bg-sand" />
      <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="aspect-[4/5] rounded-2xl bg-sand" />
        ))}
      </div>
    </div>
  );
}
