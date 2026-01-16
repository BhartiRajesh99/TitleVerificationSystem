const UserRequestsSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex flex-col sm:flex-row sm:items-center
                     justify-between gap-4
                     rounded-2xl border border-slate-200
                     bg-white px-6 py-4 shadow-sm"
        >
          {/* Left content */}
          <div className="flex-1 space-y-3">
            <div className="h-4 w-32 rounded bg-slate-200 animate-pulse" />
            <div className="h-3 w-52 rounded bg-slate-200 animate-pulse" />
            <div className="h-3 w-full max-w-md rounded bg-slate-200 animate-pulse" />
          </div>

          {/* Status badge */}
          <div className="h-6 w-24 rounded-full bg-slate-200 animate-pulse" />
        </div>
      ))}
    </div>
  );
};

export default UserRequestsSkeleton;
