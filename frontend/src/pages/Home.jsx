// import { useNavigate } from "react-router";
// export default function IntroductionPage() {
//   const navigate = useNavigate();

//   const features = [
//     {
//       icon: "🔍",
//       title: "Title Verification",
//       description:
//         "Verify the authenticity of titles using advanced similarity algorithms.",
//     },
//     {
//       icon: "📊",
//       title: "Similarity Analysis",
//       description:
//         "Get detailed similarity scores and probability analysis for each title.",
//     },
//     {
//       icon: "🔒",
//       title: "Secure Storage",
//       description:
//         "Safely store and manage your verified titles in a secure database.",
//     },
//     {
//       icon: "⚡",
//       title: "Quick Search",
//       description:
//         "Instantly search through your verified titles with our powerful search feature.",
//     },
//     {
//       icon: "📈",
//       title: "Data Insights",
//       description:
//         "Gain insights into your title data with our comprehensive analytics dashboard.",
//     },
//     {
//       icon: "🤝",
//       title: "User-Friendly Interface",
//       description:
//         "Enjoy a seamless user experience with our intuitive and easy-to-navigate interface.",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#0d2b1d] via-[#345635] to-[#6b8f71] bg-[length:200%_200%] animate-gradientShift p-8 relative overflow-hidden">
//       <div className="max-w-4xl mx-auto p-8 bg-[#e9ece5]/95 rounded-2xl shadow-2xl border border-[#aec3b0] backdrop-blur-md animate-fadeIn">
//         <h1 className="text-[#0d2b1d] text-center mb-8 text-4xl font-bold relative after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-[100px] after:h-1 after:bg-[#345635] after:rounded">
//           Title IQ
//         </h1>
//         <p className="text-[#345635] text-lg leading-relaxed mb-8 text-center px-8 font-semibold">
//           Welcome to our advanced Title Verification System. This platform helps
//           you verify, manage, and analyze titles with high accuracy and
//           efficiency. Our system uses sophisticated algorithms to ensure the
//           authenticity and uniqueness of your titles.
//         </p>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 my-12">
//           {features.map((feature, index) => (
//             <div
//               key={index}
//               className="bg-[#e9ece5]/95 text-center p-8 rounded-xl shadow-md border border-[#aec3b0] transition-transform duration-300 hover:-translate-y-1"
//             >
//               <div className="text-4xl mb-4 text-[#0d2b1d]">{feature.icon}</div>
//               <h3 className="text-[#0d2b1d] text-center mb-4 text-lg font-semibold">
//                 {feature.title}
//               </h3>
//               <p className="text-[#345635] text-center leading-snug">
//                 {feature.description}
//               </p>
//             </div>
//           ))}
//         </div>
//         <button
//           className="bg-[#0d2b1d] text-[#e3efd3] border-none px-8 py-4 rounded-lg text-lg font-semibold cursor-pointer transition-all duration-300 block mx-auto min-w-[200px] mt-12 hover:bg-[#345635] hover:shadow-xl active:scale-98 active:bg-[#0d2b1d]/90"
//           onClick={() => navigate("/verify")}
//         >
//           Start Verifying Titles
//         </button>
//       </div>
//     </div>
//   );
// }

import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800">
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 text-center">
        <span className="inline-block mb-4 px-4 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-700">
          GenAI-Powered • Scalable • Policy-Driven
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
            <h3 className="text-xl font-bold text-indigo-600">160K+ Titles</h3>
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
        <div className="mt-12 flex flex-col items-center justify-center gap-4">
          <button
            onClick={() => window.location.href = "/verify"}
            className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-lg font-semibold shadow-lg transition"
          >
            🚀 Start Verifying
          </button>

          <p className="text-sm text-slate-500">
            No login required • Real-time verification
          </p>
        </div>
      </section>

      {/* Features Section v1*/}
      {/* <section className="max-w-7xl mx-auto px-6 py-5">
        <h2 className="text-3xl font-bold text-center mb-12">
          Key System Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <FeatureCard
            title="Similarity Detection"
            desc="Detects spelling variations, sound-alike titles, and minor modifications using advanced NLP techniques."
          />

          <FeatureCard
            title="GenAI Semantic Analysis"
            desc="Understands meaning across different languages to prevent titles with the same intent."
          />

          <FeatureCard
            title="Rule & Guideline Enforcement"
            desc="Automatically rejects titles containing disallowed words, prefixes, suffixes, or periodicity changes."
          />

          <FeatureCard
            title="Verification Probability"
            desc="Displays a confidence score indicating the likelihood of a title being approved."
          />

        </div>
      </section> */}

      {/* Features Section v2*/}
      {/* <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Core Capabilities of the System
        </h2>
        <p className="text-center text-slate-600 max-w-3xl mx-auto mb-14">
          The system uses a hybrid approach combining traditional NLP techniques,
          rule-based validation, and Generative AI to ensure accurate, scalable,
          and transparent title verification.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          <FeatureCard
            title="Advanced Similarity Detection"
            desc="Identifies spelling variations, phonetic similarities, and minor textual modifications using fuzzy matching and sound-based algorithms. This prevents bypassing the system through small changes in spelling."
            points={[
              "Fuzzy & Levenshtein matching",
              "Soundex & Metaphone algorithms",
              "Prefix and suffix similarity detection"
            ]}
          />

          <FeatureCard
            title="GenAI Semantic Understanding"
            desc="Uses Generative AI to analyze the actual meaning of titles across different languages, ensuring that titles with the same intent or interpretation are detected even if the wording is different."
            points={[
              "Cross-language meaning detection",
              "Semantic embeddings & reasoning",
              "AI-generated similarity explanations"
            ]}
          />

          <FeatureCard
            title="Policy & Guideline Enforcement"
            desc="Strictly enforces predefined rules and government guidelines to prevent the use of restricted words, misleading prefixes, or periodicity-based variations of existing titles."
            points={[
              "Disallowed words validation",
              "Periodicity & combination checks",
              "Immediate rule-based rejection"
            ]}
          />

          <FeatureCard
            title="Verification Probability & Feedback"
            desc="Provides a clear probability score representing the likelihood of title approval, along with detailed and human-readable feedback explaining the decision."
            points={[
              "Transparent probability calculation",
              "Clear rejection reasons",
              "User-friendly AI explanations"
            ]}
          />

        </div>
      </section> */}

      {/* Features Section v3*/}
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



      {/* Workflow Section v1*/}
      {/* <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            How the System Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            
            <StepCard step="1" text="Submit your title for verification" />
            <StepCard step="2" text="System checks rules & similarity" />
            <StepCard step="3" text="GenAI analyzes semantic meaning" />
            <StepCard step="4" text="Decision & probability shown instantly" />

          </div>
        </div>
      </section> */}
      
      {/* Workflow Section v2*/}
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

// v1
// const FeatureCard = ({ title, desc }) => (
//   <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition">
//     <h3 className="text-xl font-semibold mb-3 text-indigo-600">
//       {title}
//     </h3>
//     <p className="text-slate-600 text-sm">
//       {desc}
//     </p>
//   </div>
// );

//v2
// const FeatureCard = ({ title, desc, points }) => (
//   <div className="bg-white rounded-2xl p-7 shadow hover:shadow-lg transition flex flex-col">
//     <h3 className="text-xl font-semibold text-indigo-600 mb-3">
//       {title}
//     </h3>

//     <p className="text-slate-600 text-sm leading-relaxed mb-4">
//       {desc}
//     </p>

//     <ul className="mt-auto space-y-2 text-sm text-slate-500">
//       {points.map((point, index) => (
//         <li key={index} className="flex items-start gap-2">
//           <span className="text-indigo-600 font-bold">•</span>
//           {point}
//         </li>
//       ))}
//     </ul>
//   </div>
// );

// v3
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


//v1
// const StepCard = ({ step, text }) => (
//   <div className="p-6">
//     <div className="w-12 h-12 mx-auto rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold mb-4">
//       {step}
//     </div>
//     <p className="text-slate-600">{text}</p>
//   </div>
// );

//v2
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
