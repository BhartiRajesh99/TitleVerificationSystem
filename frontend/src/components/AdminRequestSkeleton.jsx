const AdminRequestsSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Table Header Skeleton */}
      <div className="grid grid-cols-7 gap-4 bg-slate-100 px-4 py-3">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="h-4 w-24 rounded bg-slate-200 animate-pulse"
          />
        ))}
      </div>

      {/* Table Rows Skeleton */}
      {[1, 2, 3, 4, 5].map((row) => (
        <div
          key={row}
          className="grid grid-cols-7 gap-4 px-4 py-4
                     border-t border-slate-200"
        >
          {/* Request ID */}
          <div className="h-3 w-20 rounded bg-slate-200 animate-pulse" />

          {/* User */}
          <div className="space-y-2">
            <div className="h-3 w-28 rounded bg-slate-200 animate-pulse" />
            <div className="h-3 w-40 rounded bg-slate-200 animate-pulse" />
          </div>

          {/* Organization */}
          <div className="h-3 w-32 rounded bg-slate-200 animate-pulse" />

          {/* Message */}
          <div className="h-3 w-full max-w-xs rounded bg-slate-200 animate-pulse" />

          {/* Status */}
          <div className="h-6 w-20 rounded-full bg-slate-200 animate-pulse" />

          {/* Date */}
          <div className="h-3 w-24 rounded bg-slate-200 animate-pulse" />

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <div className="h-8 w-8 rounded-lg bg-slate-200 animate-pulse" />
            <div className="h-8 w-8 rounded-lg bg-slate-200 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminRequestsSkeleton;
