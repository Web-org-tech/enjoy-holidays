interface SkeletonProps {
  className?: string;
  lines?: number;
  style?: React.CSSProperties;
}

export function Skeleton({ className = "", style }: SkeletonProps) {
  return <div className={`skeleton ${className}`} style={style} aria-hidden="true" />;
}

export function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden" aria-hidden="true">
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="p-5 flex flex-col gap-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonPackageHero() {
  return (
    <div className="w-full h-[60vh] relative" aria-hidden="true">
      <Skeleton className="w-full h-full rounded-none" />
    </div>
  );
}

export function SkeletonText({ lines = 3 }: SkeletonProps) {
  return (
    <div className="flex flex-col gap-2" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{ width: i === lines - 1 ? "70%" : "100%" } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
