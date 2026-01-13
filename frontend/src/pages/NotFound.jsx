import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-17 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center
                      bg-white/70 backdrop-blur-xl
                      border border-slate-200
                      rounded-3xl shadow-2xl p-10">

        {/* 404 Icon */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center
                        rounded-full bg-indigo-100 text-indigo-600 text-5xl">
          🚫
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">
          404
        </h1>

        <h2 className="text-xl font-semibold text-slate-700 mb-4">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-slate-600 mb-8 leading-relaxed">
          Oops! The page you are looking for doesn’t exist or may have been moved.
          Let’s get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-xl
                       bg-indigo-600 hover:bg-indigo-700
                       text-white font-semibold
                       shadow-lg transition"
          >
            Go to Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl
                       bg-slate-100 hover:bg-slate-200
                       text-slate-700 font-semibold
                       transition"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
