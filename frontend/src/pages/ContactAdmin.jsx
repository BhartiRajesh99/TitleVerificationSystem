import { EnvelopeIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { apiUrl } from "../constants/apiURL";

const ContactAdmin = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/requests`, {
        name,
        email,
        organization,
        message,
      },
      { withCredentials: true });
      toast.success("Your request has been submitted successfully.");
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit your request. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 px-4">
      <div className="max-w-xl w-full
                      bg-white/70 backdrop-blur-xl
                      border border-slate-200
                      rounded-3xl shadow-2xl px-10 py-6 my-10">

        {/* Header */}
        <div className="text-center mb-5">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center
                          rounded-full bg-indigo-100 text-indigo-600">
            <EnvelopeIcon className="h-12 w-12" />
          </div>

          <span className="inline-block mb-3 px-4 py-1 text-sm font-semibold rounded-full
                           bg-indigo-100 text-indigo-700">
            Official Support
          </span>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Contact System Administrator
          </h1>

          <p className="mt-3 text-sm text-slate-600">
            Use this form to request access clarification or report
            registration-related issues as per policy guidelines.
          </p>
        </div>

        {/* Info Box */}
        <div className="mb-6 flex items-start gap-3 rounded-xl
                        bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600">
          <ShieldCheckIcon className="h-5 w-5 text-indigo-600 mt-0.5" />
          <p>
            Requests are reviewed manually. Please provide accurate
            and verifiable information to avoid delays.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full text-sm rounded-xl border border-slate-300
                         px-3 py-3 text-slate-700
                         focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Official Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@organization.gov.in"
              className="w-full text-sm rounded-xl border border-slate-300
                         px-4 py-3 text-slate-700
                         focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Organization / Department
            </label>
            <input
              type="text"
              required
              value={organization}
              onChange={e => setOrganization(e.target.value)}
              placeholder="Department or Authority Name"
              className="w-full text-sm rounded-xl border border-slate-300
                         px-4 py-3 text-slate-700
                         focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Message
            </label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Describe your request or issue in detail"
              className="w-full text-sm rounded-xl border border-slate-300
                         px-4 py-3 text-slate-700
                         focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-1 flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="flex-1 cursor-pointer text-sm rounded-xl bg-indigo-600 px-5 py-3
                         font-semibold text-white
                         hover:bg-indigo-700 transition">
              Submit Request
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 text-sm cursor-pointer rounded-xl border border-slate-300 px-5 py-3
                         font-semibold text-slate-700
                         hover:bg-slate-100 transition">
              Back
            </button>
          </div>
        </form>

        {/* Footer Note */}
        <p className="mt-6 text-xs text-slate-500 text-center">
          This communication channel is monitored for security and compliance purposes.
        </p>
      </div>
    </div>
  );
};

export default ContactAdmin;
