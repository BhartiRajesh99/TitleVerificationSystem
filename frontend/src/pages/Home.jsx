import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800">
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-8 text-center">
        <span className="inline-block mb-4 px-4 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-700">
          GenAI-Powered • Policy-Driven
        </span>

        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
          Intelligent Online Title
          <span className="block text-indigo-600 mt-2">
            Verification System
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
          A smart, automated platform that verifies new title submissions by combining
          linguistic rules, similarity algorithms, and <strong>Generative AI</strong>.
          Designed to prevent duplication, ensure semantic uniqueness, and comply
          with regulatory guidelines at scale.
        </p>

        {/* Highlights */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-xl font-bold text-indigo-600">15K+ Titles</h3>
            <p className="text-sm text-slate-600 mt-2">
              Efficiently searched using vector embeddings and optimized indexing.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-xl font-bold text-indigo-600">Multi-Layer AI</h3>
            <p className="text-sm text-slate-600 mt-2">
              Combines fuzzy matching, phonetic checks, and semantic GenAI reasoning.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-xl font-bold text-indigo-600">Instant Decision</h3>
            <p className="text-sm text-slate-600 mt-2">
              Provides verification decision with probability and explanation in seconds.
            </p>
          </div>
        </div>

        {/* CTA */}
      
        <div className="mt-12 flex flex-col items-center justify-center">
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
              Start Verifying
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </button>
        </div>

      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Core Capabilities
        </h2>

        <p className="text-center text-slate-600 max-w-3xl mx-auto mb-14">
          A modern, scalable verification system that combines rule-based validation,
          similarity detection, and Generative AI to ensure accurate and transparent decisions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          <FeatureCard
            icon="🧩"
            title="Similarity Detection"
            desc="Detects spelling changes, phonetic similarities, and minor variations to prevent duplicate or misleading titles."
            tags={["Fuzzy Match", "Soundex", "Metaphone"]}
          />

          <FeatureCard
            icon="🧠"
            title="GenAI Semantics"
            desc="Understands the actual meaning of titles across languages to identify intent-based similarities."
            tags={["Semantic AI", "Cross-Language", "Embeddings"]}
          />

          <FeatureCard
            icon="📜"
            title="Policy Enforcement"
            desc="Applies predefined rules and guidelines to block restricted words, prefixes, and periodicity changes."
            tags={["Disallowed Words", "Prefix Rules", "Periodicity"]}
          />

          <FeatureCard
            icon="🎯"
            title="Probability & Feedback"
            desc="Provides a verification probability score along with clear, human-readable explanations."
            tags={["Confidence Score", "AI Explanation", "Transparency"]}
          />

        </div>
      </section>
      
      {/* Workflow Section */}
      <section className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            End-to-End Verification Workflow
          </h2>

          <p className="text-center text-slate-600 max-w-3xl mx-auto mb-14">
            From submission to final decision, the system follows a structured
            multi-stage pipeline that ensures accuracy, compliance, and scalability.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center">

            <StepCard
              step="1"
              title="Title Submission"
              desc="The user submits a proposed title through the system interface. The title is sanitized, normalized, and prepared for processing."
            />

            <StepCard
              step="2"
              title="Rule & Similarity Checks"
              desc="The system applies guideline-based rules and checks the title against existing records using fuzzy and phonetic similarity techniques."
            />

            <StepCard
              step="3"
              title="GenAI Semantic Analysis"
              desc="Generative AI analyzes the semantic meaning of the title, detects cross-language similarities, and evaluates intent-based duplication."
            />

            <StepCard
              step="4"
              title="Decision & Probability"
              desc="A final decision is generated along with a verification probability score and a detailed explanation that is shown to the user."
            />

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-slate-500 text-sm">
        © 2026 | Online Title Verification System
      </footer>

    </div>
  );
};

const FeatureCard = ({ icon, title, desc, tags }) => (
  <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    
    {/* Icon */}
    <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-2xl mb-4">
      {icon}
    </div>

    {/* Title */}
    <h3 className="text-lg font-semibold mb-2 text-slate-800">
      {title}
    </h3>

    {/* Description */}
    <p className="text-sm text-slate-600 leading-relaxed mb-4">
      {desc}
    </p>

    {/* Tags */}
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600"
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);


const StepCard = ({ step, title, desc }) => (
  <div className="p-6">
    <div className="w-14 h-14 mx-auto rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg mb-4">
      {step}
    </div>

    <h4 className="text-lg font-semibold mb-2">
      {title}
    </h4>

    <p className="text-slate-600 text-sm leading-relaxed">
      {desc}
    </p>
  </div>
);


export default Home;
