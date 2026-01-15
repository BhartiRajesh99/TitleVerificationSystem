import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import Loader from "../components/Loader";

const VerifyTitle = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [hindiTitle, setHindiTitle] = useState("");
  const [publicationName, setPublicationName] = useState("");
  const [periodity, setPeriodity] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [state, setState] = useState("");
  const [formData, setFormData] = useState({
    titleCode: "",
    titleName: "",
    hindiTitle: "",
    publicationName: "",
    periodity: "",
    ownerName: "",
    state: "",
  });

  const navigate = useNavigate();

  const generateTitleCode = () => {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `TIQ-${year}-${random}`;
  };

  useEffect(() => {
    setFormData({
      titleCode: generateTitleCode(),
      titleName: title,
      hindiTitle,
      publicationName,
      periodity,
      ownerName,
      state,
    })
  }, [title, hindiTitle, publicationName, periodity, ownerName, state]);

  const apiurl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const startVerification = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${apiurl}/titles/`, formData, { withCredentials: true });

      console.log(response)

      navigate("/result", { state: { data: response.data.title, loading } });

    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred during title verification"
      );

    } finally {
      setLoading(false);
    }
  };

  const states = [
     "Andhra Pradesh",
     "Arunachal Pradesh",
     "Assam",
     "Bihar",
     "Chhattisgarh",
     "Goa",
     "Gujarat",
     "Haryana",
     "Himachal Pradesh",
     "Jharkhand",
     "Karnataka",
     "Kerala",
     "Madhya Pradesh",
     "Maharashtra",
     "Manipur",
     "Meghalaya",
     "Mizoram",
     "Nagaland",
     "Odisha",
     "Punjab",
     "Rajasthan",
     "Sikkim",
     "Tamil Nadu",
     "Telangana",
     "Tripura",
     "Uttar Pradesh",
     "Uttarakhand",
     "West Bengal",
     "Delhi",
     "Jammu and Kashmir",
     "Ladakh",
     "Chandigarh",
     "Dadra and Nagar Haveli",
     "Daman and Diu",
     "Lakshadweep",
     "Puducherry",
     "Andaman and Nicobar Islands",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800 px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block mb-3 px-4 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-700">
            GenAI • NLP • GovTech
          </span>

          <h1 className="text-5xl font-extrabold tracking-tight">
            Smart Title Verification
          </h1>

          <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
            A next-generation AI system that validates title uniqueness by
            combining regulatory rules, similarity algorithms, and semantic
            intelligence.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Form Card */}
          <div className="lg:col-span-3 backdrop-blur-xl bg-white/70 border border-slate-200 rounded-3xl shadow-xl p-10">

            <FormSection title="Title Details">
              <Input label="Title Name" value={title} required={true} onChange={(e) => setTitle(e.target.value)} placeholder="English title" />
              <Input label="Hindi Title" value={hindiTitle} onChange={(e) => setHindiTitle(e.target.value)} placeholder="हिंदी शीर्षक" />
              <Input label="Publication Name" value={publicationName} onChange={(e) => setPublicationName(e.target.value)} />
              <Select label="Periodicity" value={periodity} required={true} onChange={(e) => setPeriodity(e.target.value)} options={["Daily", "Weekly", "Monthly"]} />
            </FormSection>

            <FormSection title="Applicant Information">
              <Input label="Owner Name" value={ownerName} required={true} onChange={(e) => setOwnerName(e.target.value)} />
              <Select label="State" value={state} required={true} onChange={(e) => setState(e.target.value)} options={states} />
            </FormSection>

          </div>

          {/* AI Live Panel */}
          <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-3xl shadow-xl p-8 relative overflow-hidden">

            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_white,_transparent)]"></div>

            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              🤖 AI Evaluation Pipeline
            </h3>

            <TimelineStep text="Rule & guideline validation" />
            <TimelineStep text="Fuzzy & phonetic similarity" />
            <TimelineStep text="Cross-language semantic check" />
            <TimelineStep text="Probability & decision engine" />

            <div className="mt-10 p-4 rounded-xl bg-white/10 text-sm">
              <p className="opacity-80">Estimated processing time</p>
              <p className="text-2xl font-bold mt-1">≈ 2 seconds</p>
            </div>

          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-col items-center">
          <div className="flex flex-col items-center justify-center">
            <button
              onClick={startVerification}
              disabled={loading}
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
                {loading ? "Analyzing…" : "Start AI Verification"}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </button>
          </div>


          {loading && (
            <Loader/>
          )}
        </div>
      </div>
    </div>
  );
};

const FormSection = ({ title, children }) => (
  <>
    <h2 className="text-xl font-semibold mb-6 mt-8 border-l-4 border-indigo-600 pl-4">
      {title}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  </>
);

const Input = ({ label, value, required=false, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>
    <input
      required={required}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);

const Select = ({ label, value, required=false, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>
    <select value={value} required={required} onChange={onChange} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:ring-2 focus:ring-indigo-500">
      <option>Select</option>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);

const TimelineStep = ({ text }) => (
  <div className="flex items-center gap-3 mb-4 text-sm">
    <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
    <span className="opacity-90">{text}</span>
  </div>
);

export default VerifyTitle;
