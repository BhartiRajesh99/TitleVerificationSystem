import React from "react";
import { useLocation, useNavigate } from "react-router";

const Result = () => {

  const {state} = useLocation()
  const navigate = useNavigate()

  if (!state) {
    return (
      <div className="min-h-[60vh] mt-20 flex items-center justify-center px-4">
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
              className="px-6 py-3 rounded-xl
                        bg-indigo-600 hover:bg-indigo-700
                        text-white font-semibold
                        shadow-md transition"
            >
              Verify Another Title
            </button>

            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-xl
                        bg-slate-100 hover:bg-slate-200
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

  const {data: result} = state || {};
  const isAccepted = result.verified;

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="max-w-5xl mx-auto">

        {/* Decision Header */}
        <div
          className={`rounded-3xl p-10 shadow-xl text-white ${
            isAccepted
              ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
              : "bg-gradient-to-br from-rose-500 to-rose-600"
          }`}
        >
          <h1 className="text-4xl font-extrabold">
            {isAccepted ? "Title Approved" : "Title Rejected"}
          </h1>

          <p className="mt-3 opacity-90 max-w-2xl">
            {isAccepted
              ? "Your title has successfully passed all verification checks and meets the regulatory guidelines."
              : "Your title could not be verified as it closely resembles an existing registered title."}
          </p>
        </div>

        {/* Probability Card */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="md:col-span-1 bg-white rounded-3xl shadow p-8 text-center">
            <h3 className="text-sm text-slate-500 mb-2">
              AI Similarity Score
            </h3>
            <p className="text-5xl font-extrabold text-indigo-600">
              {result.similarity}%
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
              <strong className="block mt-1">{result.message}</strong>  
            </div>
            
          </div>
        </div>

        {/* Submitted Details */}
        <div className="mt-10 bg-white rounded-3xl shadow p-8">
          <h3 className="text-lg font-semibold mb-6">
            Submitted Title Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <Detail label="Title Name" value={result.titleName} />
            <Detail label="Hindi Title" value={result.hindiTitle || '-'} />
            <Detail label="Publication" value={result.publicationName} />
            <Detail label="State" value={result.state} />
            <Detail label="Periodicity" value={result.periodity} />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          {!isAccepted && (
            <div className="flex flex-col items-center justify-center">
              <button
                onClick={() => navigate("/verify")}
                className="
                  relative group overflow-hidden
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
