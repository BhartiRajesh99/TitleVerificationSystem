import { ShieldExclamationIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router";

const RestrictedRegistration = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 px-4">
      <div className="max-w-lg w-full text-center 
                      bg-white/70 backdrop-blur-xl
                      border border-slate-200
                      rounded-3xl shadow-2xl p-10">

        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center
                        rounded-full bg-red-100 text-red-600">
          <ShieldExclamationIcon className="h-12 w-12" />
        </div>

        {/* Badge */}
        <span className="inline-block mb-4 px-4 py-1 text-sm font-semibold rounded-full
                         bg-red-100 text-red-700">
          Access Restricted
        </span>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Registration Not Allowed
        </h1>

        {/* Description */}
        <p className="mt-4 text-sm text-slate-600 leading-relaxed">
          Registration for this platform is currently restricted.
          <br />
          Only <span className="font-semibold text-slate-800">authorized users{" "}</span> 
          are permitted to create an account as per policy guidelines.
        </p>

        {/* Divider */}
        <div className="my-6 h-px bg-slate-200" />

        {/* Info Box */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600">
          If you believe this is an error or you have received official access,
          please contact the system administrator for verification.
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 text-sm cursor-pointer rounded-xl font-semibold
                       bg-slate-900 text-white
                       hover:bg-slate-800 transition">
            Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="px-6 cursor-pointer text-sm py-3 rounded-xl font-semibold
                       border border-slate-300 text-slate-700
                       hover:bg-slate-100 transition">
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestrictedRegistration;
