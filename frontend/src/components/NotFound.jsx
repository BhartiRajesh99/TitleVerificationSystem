import { ExclamationTriangleIcon, HomeIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 px-4">
      <div className="max-w-lg w-full text-center
                      bg-white/70 backdrop-blur-xl
                      border border-slate-200
                      rounded-3xl shadow-2xl p-10">

        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center
                        rounded-full bg-amber-100 text-amber-600">
          <ExclamationTriangleIcon className="h-10 w-10" />
        </div>

        {/* Code */}
        <h1 className="text-6xl font-extrabold tracking-tight text-slate-900">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-3 text-2xl font-bold text-slate-800">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-4 text-sm text-slate-600 leading-relaxed">
          The page you are trying to access does not exist or may have been
          moved as part of system updates.
          <br />
          Please verify the URL or return to a valid section of the platform.
        </p>

        {/* Divider */}
        <div className="my-6 h-px bg-slate-200" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center cursor-pointer justify-center gap-2
                       px-6 py-3 rounded-xl font-semibold
                       bg-slate-900 text-white
                       hover:bg-slate-800 transition">
            <HomeIcon className="h-5 w-5" />
            Home
          </button>

          <button
            onClick={() => navigate("/verify")}
            className="px-6 py-3 cursor-pointer rounded-xl font-semibold
                       border border-slate-300 text-slate-700
                       hover:bg-slate-100 transition">
            Verify Title
          </button>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-xs text-slate-500">
          Error Code: <span className="font-mono">SYS-404</span>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
