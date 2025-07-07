import { useNavigate } from "react-router";
export default function IntroductionPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: "🔍",
      title: "Title Verification",
      description:
        "Verify the authenticity of titles using advanced similarity algorithms.",
    },
    {
      icon: "📊",
      title: "Similarity Analysis",
      description:
        "Get detailed similarity scores and probability analysis for each title.",
    },
    {
      icon: "🔒",
      title: "Secure Storage",
      description:
        "Safely store and manage your verified titles in a secure database.",
    },
    {
      icon: "⚡",
      title: "Quick Search",
      description:
        "Instantly search through your verified titles with our powerful search feature.",
    },
    {
      icon: "📈",
      title: "Data Insights",
      description:
        "Gain insights into your title data with our comprehensive analytics dashboard.",
    },
    {
      icon: "🤝",
      title: "User-Friendly Interface",
      description:
        "Enjoy a seamless user experience with our intuitive and easy-to-navigate interface.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d2b1d] via-[#345635] to-[#6b8f71] bg-[length:200%_200%] animate-gradientShift p-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto p-8 bg-[#e9ece5]/95 rounded-2xl shadow-2xl border border-[#aec3b0] backdrop-blur-md animate-fadeIn">
        <h1 className="text-[#0d2b1d] text-center mb-8 text-4xl font-bold relative after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-[100px] after:h-1 after:bg-[#345635] after:rounded">
          Title IQ
        </h1>
        <p className="text-[#345635] text-lg leading-relaxed mb-8 text-center">
          Welcome to our advanced Title Verification System. This platform helps
          you verify, manage, and analyze titles with high accuracy and
          efficiency. Our system uses sophisticated algorithms to ensure the
          authenticity and uniqueness of your titles.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 my-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#e9ece5]/95 p-8 rounded-xl shadow-md border border-[#aec3b0] transition-transform duration-300 hover:-translate-y-1 animate-fadeIn"
            >
              <div className="text-4xl mb-4 text-[#0d2b1d]">{feature.icon}</div>
              <h3 className="text-[#0d2b1d] mb-4 text-xl font-semibold">
                {feature.title}
              </h3>
              <p className="text-[#345635] leading-snug">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        <button
          className="bg-[#0d2b1d] text-[#e3efd3] border-none px-8 py-4 rounded-lg text-lg font-semibold cursor-pointer transition-all duration-300 block mx-auto min-w-[200px] mt-12 hover:bg-[#345635] hover:-translate-y-1 hover:shadow-xl active:translate-y-0 animate-bounceIn"
          onClick={() => navigate("/verify")}
        >
          Start Verifying Titles
        </button>
      </div>
    </div>
  );
}
