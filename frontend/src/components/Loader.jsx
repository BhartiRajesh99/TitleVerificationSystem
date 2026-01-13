import { ShieldCheck, Sparkles } from "lucide-react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sky-50/80 backdrop-blur-sm">
      {/* Glass Card */}
      <div className="relative w-[360px] rounded-3xl border border-indigo-200 bg-white/80 backdrop-blur-2xl shadow-[0_20px_70px_rgba(79,70,229,0.28)] p-10 text-center overflow-hidden">

        {/* Spinner */}
        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
          <div className="absolute h-full w-full animate-spin rounded-full border-[3px] border-indigo-300/30 border-t-indigo-500" />
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
            <ShieldCheck className="h-6 w-6 text-indigo-600" />
          </div>
        </div>

        {/* Text */}
        <h2 className="relative text-lg font-semibold text-slate-800">
          Verifying Title
        </h2>

        <p className="relative mt-2 flex items-center justify-center gap-2 text-sm text-slate-600">
          <Sparkles className="h-4 w-4 animate-pulse text-indigo-500" />
          AI is analyzing records
        </p>

        {/* Animated dots */}
        <div className="relative mt-6 flex justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce" />
          <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:150ms]" />
          <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:300ms]" />
        </div>

        {/* Footer hint */}
        <p className="relative mt-6 text-xs text-slate-500">
          Secure • Verified • Government compliant
        </p>
      </div>
    </div>
  );
};

export default Loader;
