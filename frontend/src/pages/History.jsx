import axios from "axios";
import { useRef } from "react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { TrashIcon } from "@heroicons/react/24/outline";

const History = () => {
  const [loading, setLoading] = useState(false);
  const [searchCode, setSearchCode] = useState("");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [titles, setTitles] = useState([]);
  const [totalTitlesCount, setTotalTitlesCount] = useState([]);

  const acceptedCount = totalTitlesCount.filter(s => s.verified).length;
  const rejectedCount = totalTitlesCount.length - acceptedCount;

  const apiurl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

  const getAllUserTitles = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${apiurl}/titles/all`, { withCredentials: true });
      console.log(response)
      setTitles(response.data.results);
      setTotalTitlesCount(response.data?.results || []);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while fetching title history"
      );
    } finally {
      setLoading(false)
    }
  }

  const getTitleByFilter = async (titleCode="", state="", status="") => {
    setLoading(true);
    try {
      
      const response = await axios.get(
        `${apiurl}/titles/search?titleCode=${titleCode}&state=${state}&status=${status}`,
        { withCredentials: true }
      );
      console.log(response);
      setTitles(response.data.results);
      toast.success("Title fetched successfully");
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while fetching title"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (titleId) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${apiurl}/titles/${titleId}`, { withCredentials: true });
      console.log(response);
      toast.success(response.data.message || "Title deleted successfully");
      // Refresh titles list
      getAllUserTitles();
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while deleting the title"
      );
    } finally {
      setLoading(false);
    }
  }

  const hasUserInteracted = useRef(false);
  useEffect(() => {
    if (!hasUserInteracted.current) return;

    const delay = setTimeout(() => {
      console.log("filter titles");
      getTitleByFilter(searchCode, selectedState, selectedStatus);
    }, 2000); // 500ms debounce

    return () => clearTimeout(delay);
  }, [searchCode, selectedState, selectedStatus]);

  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    console.log("fetch all titles");
    getAllUserTitles(); 
  }, [])

 
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-50 px-6 py-14">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-12 flex flex-col gap-4 justify-center items-center">
          <h1 className="text-4xl text-center font-extrabold mb-2">
            Submission History
          </h1>
          <p className="text-slate-600 text-center max-w-3xl">
            A complete audit trail of all submitted titles with AI-generated
            decisions, probability scores, and verification status.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <KpiCard title="Total Submissions" value={totalTitlesCount.length} />
          <KpiCard title="Accepted Titles" value={acceptedCount} accent="green" />
          <KpiCard title="Rejected Titles" value={rejectedCount} accent="red" />
        </div>

        {/* Search & Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            placeholder="Search title by ID"
            onChange={(e) => {
              hasUserInteracted.current = true;
              setSearchCode(e.target.value)
            }}
            className="flex-1 px-5 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
          />

          <select value={selectedState} 
            onChange={(e) => {
              hasUserInteracted.current = true;
              setSelectedState(e.target.value)
            }} 
            className="flex-[0.5] px-5 py-3 rounded-xl border border-slate-300 bg-white"
          >
            <option>All States</option>
            {states.map((state) => (
              <option key={state}>{state}</option>
            ))}
          </select>

          <select value={selectedStatus} 
            onChange={(e) => {
              hasUserInteracted.current = true;
              setSelectedStatus(e.target.value)
            }} 
            className="flex-[0.5] px-5 py-3 rounded-xl border border-slate-300 bg-white"
          >
            <option>All Status</option>
            <option>Accepted</option>
            <option>Rejected</option>
          </select>
        </div>

        {/* Glass Table */}
        <div className="backdrop-blur-xl bg-white/70 border border-slate-200 rounded-3xl shadow-xl overflow-hidden">

          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-6 py-4 text-left">ID</th>
                <th className="px-6 py-4 text-left">Title</th>
                <th className="px-6 py-4 text-left">State</th>
                <th className="px-6 py-4 text-left">Periodicity</th>
                <th className="px-6 py-4 text-left">Probability</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {titles.map((item) => (
                <tr
                  key={item.id}
                  className="border-t hover:bg-indigo-50/40 transition"
                >
                  <td className="px-6 py-4 font-semibold text-indigo-600">
                    {item.titleCode}
                  </td>
                  <td className="px-6 py-4">{item.titleName}</td>
                  <td className="px-6 py-4">{item.state}</td>
                  <td className="px-6 py-4">{item.periodity}</td>
                  <td className="px-6 py-4 font-semibold">
                    {item.verificationProbability}%
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.verified ? "ACCEPTED" : "REJECTED"} />
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {item.createdAt.split("T")[0]}
                  </td>
                  <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="group cursor-pointer inline-flex items-center justify-center rounded-full p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete title"
                      >
                        <TrashIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      </button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ title, value, accent }) => (
  <div className="bg-white rounded-2xl shadow p-6">
    <p className="text-sm text-slate-500">{title}</p>
    <p
      className={`text-3xl font-extrabold mt-2 ${
        accent === "green"
          ? "text-emerald-600"
          : accent === "red"
          ? "text-rose-600"
          : "text-indigo-600"
      }`}
    >
      {value}
    </p>
  </div>
);

const StatusBadge = ({ status }) => {
  const isAccepted = status === "ACCEPTED";
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
        isAccepted
          ? "bg-emerald-100 text-emerald-700"
          : "bg-rose-100 text-rose-700"
      }`}
    >
       {status}
    </span>
  );
};

export default History;
