import { useLocation, useNavigate } from "react-router";
import Loader from "../components/Loader";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";


const Result = () => {

  const {state} = useLocation()
  const navigate = useNavigate()

  if (!state) {
    return (
      <div className="min-h-[76vh] flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-md w-full text-center 
                        bg-white/70 backdrop-blur-xl
                        border border-slate-200
                        rounded-3xl shadow-xl p-10">

          {/* Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center
                          rounded-full bg-indigo-100 text-indigo-600 text-4xl">
            🔍
          </div>

          {/* Heading */}
          <h3 className="text-2xl font-extrabold text-slate-800 mb-2">
            No Results Found
          </h3>

          {/* Description */}
          <p className="text-slate-600 mb-8">
            We couldn’t find any data for this request.
            Try verifying a different title or go back to the homepage.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/verify")}
              className="px-6 py-3 cursor-pointer rounded-xl
                        bg-indigo-600 hover:bg-indigo-700
                        text-white font-semibold
                        shadow-md transition"
            >
              Verify Another Title
            </button>

            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-xl
                        bg-slate-100 cursor-pointer hover:bg-slate-200
                        text-slate-700 font-semibold
                        transition"
            >
              Go Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if(state.loading){
    return <Loader />
  }

  const {data: result} = state || {};
  const isAccepted = result.verified;

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-14">
        {/* Badge */}
        <span className="inline-block mb-3 px-4 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-700">
          AI Verified • Policy Driven • Secure
        </span>

        {/* Title */}
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
          Title Verification Result
        </h1>

        {/* Description */}
        <p className="mt-4 text-md text-slate-600 max-w-3xl mx-auto">
          The submitted title has been evaluated using phonetic matching,
          semantic analysis, and regulatory validation to ensure uniqueness
          and compliance with publication guidelines.
        </p>
      </div>

      {/* Decision Header */}
      <div
        className={`
          relative overflow-hidden rounded-3xl p-6 shadow-[0_4px_10px_rgba(0,0,0,0.25)]
          backdrop-blur-xl border border-white/20
          ${
            isAccepted
              ? "bg-gradient-to-br from-emerald-500 via-emerald-500 to-emerald-600"
              : "bg-gradient-to-br from-rose-500 via-rose-500 to-rose-600"
          }
          text-white
        `}
      >
        {/* Glow layer */}
        <div
          className={`
            absolute -inset-1 opacity-30 blur-3xl
            ${
              isAccepted
                ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                : "bg-gradient-to-r from-rose-400 to-rose-600"
            }
          `}
        />

        {/* Content */}
        <div className="relative flex flex-col gap-2">

          {/* Header */}
          <div className="flex items-center gap-2">
            <div
              className={`
                flex h-12 w-12 items-center justify-center rounded-2xl
                bg-white/20 backdrop-blur
              `}
            >
              {isAccepted ? (
                <CheckCircleIcon className="h-8 w-8 text-white" />
              ) : (
                <XCircleIcon className="h-8 w-8 text-white" />
              )}
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight">
              {isAccepted ? "Title Approved" : "Title Rejected"}
            </h1>
          </div>

          {/* Description */}
          <p className="max-w-2xl text-md leading-relaxed text-white/90">
            {isAccepted
              ? "Your title has successfully passed all AI, similarity, and regulatory verification checks."
              : "Your title could not be approved because it closely matches an existing registered title under verification rules."}
          </p>

          {/* Footer Hint */}
          <div className="mt-1 flex items-center gap-3 text-sm text-white/80">
            <span className="inline-block rounded-full bg-white/20 px-4 py-1 font-semibold">
              AI Verified
            </span>
            <span>Policy compliant • Secure decision</span>
          </div>
        </div>
      </div>


        {/* Probability Card */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="md:col-span-1 bg-white rounded-3xl shadow p-8 text-center">
            <h3 className="text-sm text-slate-500 mb-2">
              AI Similarity Score
            </h3>
            <p className="text-5xl font-extrabold text-indigo-600">
              {result.similarity ? `${result.similarity}%` : "-"}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              (Lower is better)
            </p>
          </div>

          <div className="md:col-span-2 bg-white rounded-3xl shadow p-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              🤖 AI Decision Explanation
            </h3>

            <div className={`mt-4 p-4 rounded-xl  ${!isAccepted ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"} text-sm`}>
              <strong className="block mt-1">{result.message || "-"}</strong>  
            </div>
            
          </div>
        </div>

        {/* Submitted Details */}
        <div className="mt-10 bg-white rounded-3xl shadow p-8">
          <h3 className="text-lg font-semibold mb-6">
            Submitted Title Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <Detail label="Title Name" value={result.titleName || "-"} />
            <Detail label="Hindi Title" value={result.hindiTitle || '-'} />
            <Detail label="Publication" value={result.publicationName || "-"} />
            <Detail label="State" value={result.state || "-"} />
            <Detail label="Periodicity" value={result.periodity || "-"} />
          </div>
        </div>

        {/* AI Suggestions (Only for Rejected Titles) */}
        {!isAccepted && result.suggestions?.length > 0 && (
          <div className="mt-10 relative overflow-hidden rounded-3xl
                          bg-slate-50
                          border border-slate-200 shadow-lg p-8">

            <div className="relative">

              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-xl
                                bg-indigo-600
                                flex items-center justify-center text-white text-xl">
                  💡
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    AI Suggestions for Improvement
                  </h3>
                  <p className="text-sm text-slate-600">
                    Recommended changes to improve approval probability.
                  </p>
                </div>
              </div>

              {/* Suggestions List */}
              <div className="space-y-4">
                {result.suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="group flex items-start gap-4
                              rounded-2xl bg-white
                              border border-slate-200 p-5
                              hover:border-indigo-300 hover:shadow-md
                              transition-all duration-200"
                  >
                    {/* Step */}
                    <div className="flex h-9 w-9 shrink-0
                                    items-center justify-center
                                    rounded-lg bg-slate-200 text-slate-700
                                    font-semibold">
                      {index + 1}
                    </div>

                    {/* Text */}
                    <div>
                      <p className="font-semibold text-slate-800">
                        {suggestion}
                      </p>

                      <p className="mt-2 text-xs text-slate-500">
                        Suggested Adjustment •
                        Helps reduce similarity and improve uniqueness
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-6 flex items-center gap-3 text-sm text-slate-600">
                <span className="inline-block rounded-full bg-indigo-50 px-3 py-1
                                text-indigo-700 font-semibold">
                  AI-Assisted Guidance
                </span>
                <span>
                  Suggestions are advisory, not mandatory.
                </span>
              </div>

            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          {!isAccepted && (
            <div className="flex flex-col items-center justify-center">
              <button
                onClick={() => navigate("/verify")}
                className="
                  relative group overflow-hidden cursor-pointer
                  px-12 py-4 rounded-2xl
                  text-lg font-semibold text-white
                  bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600
                  shadow-[0_20px_40px_rgba(79,70,229,0.35)]
                  transition-all duration-300 ease-out
                  hover:scale-[1.03] hover:shadow-[0_30px_60px_rgba(79,70,229,0.45)]
                  active:scale-[0.97]
                "
              >
                {/* Glow layer */}
                <span
                  className="
                    absolute inset-0
                    bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500
                    opacity-0 group-hover:opacity-20
                    blur-2xl transition-opacity duration-300
                  "
                />

                {/* Shine animation */}
                <span
                  className="
                    absolute inset-0
                    -translate-x-full group-hover:translate-x-full
                    bg-gradient-to-r from-transparent via-white/30 to-transparent
                    transition-transform duration-700
                  "
                />

                {/* Text */}
                <span className="relative z-10 flex items-center gap-2">
                  Modify & Resubmit
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </button>
            </div>

          )}

          <button
            onClick={() => (navigate("/"))}
            className="px-10 py-3 rounded-2xl bg-white border border-slate-300 hover:bg-slate-100 font-semibold"
          >
            Back to Home
          </button>
        </div>

      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-slate-500">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default Result;
