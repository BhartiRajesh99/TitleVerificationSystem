import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "../api/axios.js";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function NavbarComponent({ onSearch, user, onLogout, setShowSearchModal }) {
  const displayName = user?.email?.split("@")[0] || "User";

  return (
    <nav className="flex justify-between items-center bg-[#0d2b1d] text-[#e3efd3] px-8 py-4 shadow-md mb-4">
      <button
        className="bg-[#e3efd3] text-[#0d2b1d] border-2 border-[#0d2b1d] px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:bg-[#aec3b0] hover:border-[#345635] mx-2"
        onClick={() => setShowSearchModal(true)}
      >
        🔍 Search Titles
      </button>
      <div className="flex items-center gap-4 mx-2">
        <img
          src={user?.avatar || "/default-avatar.jpg"}
          alt="avatar"
          className="w-10 h-10 rounded-full border-2 border-white object-cover object-center transition-transform hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-avatar.jpg";
          }}
        />
        <span className="text-white font-semibold text-lg capitalize px-4 py-2 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:shadow-md transition-all">
          {displayName}
        </span>
        <button
          className="bg-[#0d2b1d] text-[#e3efd3] border-2 border-[#0d2b1d] px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:bg-[#345635] hover:border-[#345635]"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default function VerificationPage() {
  const [results, setResults] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTitles, setIsLoadingTitles] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  // Form state for new title
  const [formData, setFormData] = useState({
    titleCode: "",
    titleName: "",
    hindiTitle: "",
    registerSerialNo: "",
    regnNo: "",
    ownerName: "",
    state: "",
    stateCode: "",
    publicationCity: "",
    periodity: "",
  });

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSearchModal = async () => {
    if (!searchQuery.trim()) return;
    setIsSearchLoading(true);
    await handleSearch(searchQuery);
    setIsSearchLoading(false);
    setShowSearchModal(false);
    setSearchQuery("");
  };

  const fetchAllTitles = async () => {
    setIsLoadingTitles(true);
    try {
      const { data } = await axios.get("/titles/all");
      setResults(data.results);
    } catch (err) {
      const message = err.response?.data?.message || "Error fetching titles";
      toast.error(message);
    } finally {
      setIsLoadingTitles(false);
    }
  };

  useEffect(() => {
    fetchAllTitles();
  }, []);

  const handleSearch = async (q) => {
    setFeedback("");
    try {
      const { data } = await axios.get(
        `/titles/search?q=${encodeURIComponent(q)}`
      );
      setResults(data.results);
      setSearchActive(true);
      if (data.results.length === 0) {
        toast.error("No results found");
      } else
        toast.success("Titles found")
    } catch (err) {
      const message = err.response?.data?.message || "Error";
      setFeedback({ message, error: true });
      toast.error(message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "state") {
      const selected = states.find((s) => s.name === value);
      setFormData((prev) => ({
        ...prev,
        state: value,
        stateCode: selected ? selected.code : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAdd = async () => {
    if (!formData.titleName.trim()) {
      toast.error("Title name is required");
      return;
    }
    setFeedback("");
    setIsLoading(true);
    try {
      const { data } = await axios.post("/titles", formData);
      const message = `Success! Verification Probability: ${data.verificationProbability}%`;
      setFeedback({ message, error: false });
      toast.success(message);

      // Reset form
      setFormData({
        titleCode: "",
        titleName: "",
        hindiTitle: "",
        registerSerialNo: "",
        regnNo: "",
        ownerName: "",
        state: "",
        stateCode: "",
        publicationCity: "",
        periodity: "",
      });

      fetchAllTitles();
    } catch (err) {
      const message = err.response?.data?.message || "Error";
      setFeedback({ message, error: true });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setFeedback("");
    try {
      await axios.delete(`/titles/${id}`);
      const message = "Title deleted successfully";
      setFeedback({ message, error: false });
      toast.success(message);
      fetchAllTitles();
    } catch (err) {
      const message = err.response?.data?.message || "Error";
      setFeedback({ message, error: true });
      toast.error(message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const states = [
    { name: "Andhra Pradesh", code: "AP" },
    { name: "Arunachal Pradesh", code: "AR" },
    { name: "Assam", code: "AS" },
    { name: "Bihar", code: "BR" },
    { name: "Chhattisgarh", code: "CG" },
    { name: "Goa", code: "GA" },
    { name: "Gujarat", code: "GJ" },
    { name: "Haryana", code: "HR" },
    { name: "Himachal Pradesh", code: "HP" },
    { name: "Jharkhand", code: "JHA" },
    { name: "Karnataka", code: "KA" },
    { name: "Kerala", code: "KL" },
    { name: "Madhya Pradesh", code: "MP" },
    { name: "Maharashtra", code: "MAH" },
    { name: "Manipur", code: "MN" },
    { name: "Meghalaya", code: "ML" },
    { name: "Mizoram", code: "MZ" },
    { name: "Nagaland", code: "NL" },
    { name: "Odisha", code: "OR" },
    { name: "Punjab", code: "PB" },
    { name: "Rajasthan", code: "RAJ" },
    { name: "Sikkim", code: "SK" },
    { name: "Tamil Nadu", code: "TN" },
    { name: "Telangana", code: "TG" },
    { name: "Tripura", code: "TR" },
    { name: "Uttar Pradesh", code: "UP" },
    { name: "Uttarakhand", code: "UTT" },
    { name: "West Bengal", code: "WB" },
    { name: "Delhi", code: "DEL" },
    { name: "Jammu and Kashmir", code: "JK" },
    { name: "Ladakh", code: "LA" },
    { name: "Chandigarh", code: "CH" },
    { name: "Dadra and Nagar Haveli", code: "DN" },
    { name: "Daman and Diu", code: "DD" },
    { name: "Lakshadweep", code: "LD" },
    { name: "Puducherry", code: "PY" },
    { name: "Andaman and Nicobar Islands", code: "AN" },
  ];

  const periodities = ["Daily", "Weekly", "Monthly"];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0d2b1d] via-[#345635] to-[#6b8f71] animate-gradientShift bg-[length:200%_200%]">
      {/* Navbar */}
      <NavbarComponent
        onSearch={handleSearch}
        user={user}
        onLogout={handleLogout}
        setShowSearchModal={setShowSearchModal}
      />

      {/* Main Content */}
      <main className="max-w-5xl w-full mx-auto flex-1 px-6 mt-10 animate-fadeIn">
        {/* Verification Card */}
        <section className="bg-[#e9ece5]/95 p-10 rounded-2xl shadow-lg mb-16 border border-[#aec3b0] backdrop-blur-md transition-transform hover:-translate-y-1 hover:scale-[1.01] hover:shadow-2xl animate-fadeIn">
          <h2 className="text-[#0d2b1d] mb-10 text-2xl font-bold relative after:content-[''] after:absolute after:bottom-[-0.5em] after:left-0 after:w-1/4 after:h-1 after:bg-[#345635] after:rounded">
            Add New Title for Verification
          </h2>
          <form
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8 mb-10"
            onSubmit={(e) => {
              e.preventDefault();
              handleAdd();
            }}
          >
            <div className="flex flex-col gap-1">
              <label className="text-[#0d2b1d] font-semibold text-xs uppercase tracking-wide">
                Title Code
              </label>
              <input
                type="text"
                name="titleCode"
                placeholder="Enter title code"
                value={formData.titleCode}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-[#6b8f71] rounded-lg text-base bg-[#e3efd3] text-[#0d2b1d] transition-all focus:border-[#345635] focus:shadow-lg focus:outline-none hover:shadow-md"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[#0d2b1d] font-semibold text-xs uppercase tracking-wide">
                Title Name *
              </label>
              <input
                type="text"
                name="titleName"
                placeholder="Enter title name"
                value={formData.titleName}
                onChange={handleInputChange}
                required
                className="w-full p-3 border-2 border-[#6b8f71] rounded-lg text-base bg-[#e3efd3] text-[#0d2b1d] transition-all focus:border-[#345635] focus:shadow-lg focus:outline-none hover:shadow-md"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[#0d2b1d] font-semibold text-xs uppercase tracking-wide">
                Hindi Title
              </label>
              <input
                type="text"
                name="hindiTitle"
                placeholder="Enter Hindi title"
                value={formData.hindiTitle}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-[#6b8f71] rounded-lg text-base bg-[#e3efd3] text-[#0d2b1d] transition-all focus:border-[#345635] focus:shadow-lg focus:outline-none hover:shadow-md"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[#0d2b1d] font-semibold text-xs uppercase tracking-wide">
                Registration Serial No
              </label>
              <input
                type="text"
                name="registerSerialNo"
                placeholder="Enter registration serial number"
                value={formData.registerSerialNo}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-[#6b8f71] rounded-lg text-base bg-[#e3efd3] text-[#0d2b1d] transition-all focus:border-[#345635] focus:shadow-lg focus:outline-none hover:shadow-md"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[#0d2b1d] font-semibold text-xs uppercase tracking-wide">
                Registration Number
              </label>
              <input
                type="text"
                name="regnNo"
                placeholder="Enter registration number"
                value={formData.regnNo}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-[#6b8f71] rounded-lg text-base bg-[#e3efd3] text-[#0d2b1d] transition-all focus:border-[#345635] focus:shadow-lg focus:outline-none hover:shadow-md"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[#0d2b1d] font-semibold text-xs uppercase tracking-wide">
                Owner Name
              </label>
              <input
                type="text"
                name="ownerName"
                placeholder="Enter owner name"
                value={formData.ownerName}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-[#6b8f71] rounded-lg text-base bg-[#e3efd3] text-[#0d2b1d] transition-all focus:border-[#345635] focus:shadow-lg focus:outline-none hover:shadow-md"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[#0d2b1d] font-semibold text-xs uppercase tracking-wide">
                State
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-[#6b8f71] rounded-lg text-base bg-[#e3efd3] text-[#0d2b1d] transition-all focus:border-[#345635] focus:shadow-lg focus:outline-none hover:shadow-md cursor-pointer"
              >
                <option value="">Select state</option>
                {states.map((state) => (
                  <option key={state.name} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[#0d2b1d] font-semibold text-xs uppercase tracking-wide">
                Publication City
              </label>
              <input
                type="text"
                name="publicationCity"
                placeholder="Enter publication city"
                value={formData.publicationCity}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-[#6b8f71] rounded-lg text-base bg-[#e3efd3] text-[#0d2b1d] transition-all focus:border-[#345635] focus:shadow-lg focus:outline-none hover:shadow-md"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[#0d2b1d] font-semibold text-xs uppercase tracking-wide">
                Periodicity
              </label>
              <select
                name="periodity"
                value={formData.periodity}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-[#6b8f71] rounded-lg text-base bg-[#e3efd3] text-[#0d2b1d] transition-all focus:border-[#345635] focus:shadow-lg focus:outline-none hover:shadow-md cursor-pointer"
              >
                <option value="">Select periodicity</option>
                {periodities.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </div>
          </form>
          <button
            className="bg-[#0d2b1d] text-[#e3efd3] border-2 border-[#0d2b1d] px-10 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:bg-[#345635] hover:border-[#345635] mt-6 mx-2"
            onClick={handleAdd}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="inline-block w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                Verifying...
              </>
            ) : (
              "Verify Title"
            )}
          </button>
        </section>

        {/* Results Section */}
        <section className="mt-12">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-6 px-2">
            <h3 className="text-[#e3efd3] text-xl font-semibold mb-0">
              Your Titles ({results.length})
              {isLoadingTitles && (
                <span className="inline-block w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin ml-2"></span>
              )}
            </h3>
            {searchActive && (
              <span
                className="text-[#e3efd3] font-semibold underline cursor-pointer ml-4 transition-colors duration-200 hover:text-[#93a194]"
                onClick={() => {
                  fetchAllTitles();
                  setFeedback("");
                  setSearchActive(false);
                }}
              >
                Show All Titles
              </span>
            )}
          </div>
          {results.length === 0 ? (
            <div className="text-center py-16 text-white text-lg">
              No titles found. Add your first title above!
            </div>
          ) : (
            <div className="space-y-3 px-2 mb-12">
              {results.map((r, i) => (
                <div
                  key={r.id}
                  className="bg-[#e9ece5]/95 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center border border-[#aec3b0] shadow-md transition-transform hover:scale-[1.01] hover:shadow-xl animate-fadeIn gap-2"
                  style={{ animationDelay: `${i * 60 + 200}ms` }}
                >
                  <div className="flex flex-col gap-2 flex-1">
                    <span className="text-[#0d2b1d] font-bold text-lg mb-1">
                      {r.titleName}
                    </span>
                    {r.hindiTitle && (
                      <span className="text-[#345635] text-base italic">
                        {r.hindiTitle}
                      </span>
                    )}
                    <span className="text-[#6b8f71] text-sm flex flex-wrap gap-2 mt-1">
                      {r.titleCode && <span>Code: {r.titleCode}</span>}
                      {r.regnNo && <span>Regn: {r.regnNo}</span>}
                      {r.ownerName && <span>Owner: {r.ownerName}</span>}
                      {r.state && <span>State: {r.state}</span>}
                      {r.stateCode && <span>State Code: {r.stateCode}</span>}
                      {r.publicationCity && (
                        <span>City: {r.publicationCity}</span>
                      )}
                      {r.periodity && <span>Period: {r.periodity}</span>}
                      <span>Verified: {r.verified ? "✅" : "❌"}</span>
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-2 min-w-[120px]">
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-semibold text-center w-36 inline-block ${
                        r.similarity > 70
                          ? "bg-red-400 text-white"
                          : r.similarity > 40
                          ? "bg-yellow-300 text-[#0d2b1d]"
                          : "bg-green-300 text-[#0d2b1d]"
                      }`}
                    >
                      Similarity: {r.similarity}%
                    </div>
                    {/* <div
                      className={`px-3 py-1 rounded-full text-sm font-semibold text-center w-36 inline-block ${
                        r.verificationProbability > 80
                          ? "bg-green-300 text-[#0d2b1d]"
                          : r.verificationProbability > 60
                          ? "bg-yellow-300 text-[#0d2b1d]"
                          : "bg-red-400 text-white"
                      }`}
                    >
                      Verification: {r.verificationProbability}%
                    </div> */}
                  </div>
                  <div className="flex gap-3 ml-0 md:ml-6 mt-6 md:mt-0">
                    <button
                      className="bg-[#e3efd3] text-[#0d2b1d] border-2 border-[#0d2b1d] px-6 py-2 rounded-lg font-semibold transition-all hover:bg-[#aec3b0] hover:border-[#345635]"
                      onClick={() => handleDelete(r.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Search Modal */}
      {showSearchModal && (
        <>
          <div
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-[1000] backdrop-blur-sm p-5"
            onClick={() => setShowSearchModal(false)}
          ></div>
          <div className="bg-[#e9ece5]/95 p-8 rounded-xl shadow-2xl border border-[#aec3b0] backdrop-blur-md min-w-[400px] max-w-[700px] w-full z-[1001] animate-fadeIn absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4">
            <h2 className="text-[#0d2b1d] mb-6 text-2xl font-bold relative after:content-[''] after:absolute after:bottom-[-0.5em] after:left-0 after:w-1/4 after:h-1 after:bg-[#345635] after:rounded">
              Search Titles
            </h2>
            <input
              type="text"
              placeholder="Enter title to search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchModal()}
              className="w-full p-3 border-2 border-[#6b8f71] rounded-lg text-base bg-[#e3efd3] text-[#0d2b1d] transition-all focus:border-[#345635] focus:shadow-lg focus:outline-none hover:shadow-md"
            />
            <button
              className="bg-[#0d2b1d] text-[#e3efd3] text-xl border-2 border-[#0d2b1d] px-6 py-3 rounded-xl font-semibold transition-all hover:bg-[#345635] hover:border-[#345635] mt-2"
              onClick={handleSearchModal}
              disabled={isSearchLoading}
            >
              {isSearchLoading ? (
                <>
                  <span className="inline-block w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
