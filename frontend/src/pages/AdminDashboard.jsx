import { TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";

const AdminDashboard = () => {

  const [allTitlesCount, setAllTitlesCount] = useState(0);
  const [todayRequests, setTodayRequests] = useState(0);
  const [approvedTitles, setApprovedTitles] = useState(0);
  const [rejectedTitles, setRejectedTitles] = useState(0);
  const [rejectionInsights, setRejectionInsights] = useState(null);
  const [probabilityBreakdown, setProbabilityBreakdown] = useState(null);
  const [topStates, setTopStates] = useState(null);
  const [recentSubmissions, setRecentSubmissions] = useState(null);
  

  const apiurl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const fetchTodayRequests = async () => {
    try {
      const res = await axios.get(`${apiurl}/admin/today-requests`, { withCredentials: true });
      
      console.log(res)
      if (res.data.success) {
        setTodayRequests(res.data.count);
      }

    } catch (error) {
      console.log(error)
      toast.error(
        error.response?.data?.message ||
          "An error occurred while fetching today's requests count"
      );
    }
  };

  const getAdminStats = async () => {
    try {
      const res = await axios.get(`${apiurl}/admin/stats`, { withCredentials: true });
      console.log(res)
      if (res.data.success) {
        setApprovedTitles(res.data.approved);
        setRejectedTitles(res.data.rejected);
        setAllTitlesCount(res.data.total);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while fetching approved titles percentage"
      );
    }
  };

  const getRejectionInsights = async () => {
    try {
      const res = await axios.get(`${apiurl}/admin/rejection-insights`, { withCredentials: true });
      console.log(res)
      if (res.data.success) {
        setRejectionInsights(res.data?.insights);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while fetching rejection insights"
      );
    }
  };

  const getProbabilityBreakdown = async () => {
    try {
      const res = await axios.get(`${apiurl}/admin/probability-breakdown`, { withCredentials: true });
      console.log(res)
      if (res.data.success) {
        setProbabilityBreakdown(res.data?.breakdown);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while fetching probability breakdown"
      );
    }
  };

  const getTopStatesBySubmissions = async () => {
    try {
      const res = await axios.get(`${apiurl}/admin/top-states`, { withCredentials: true });
      console.log(res)
      if (res.data.success) {
        setTopStates(res.data?.states);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while fetching top states by submissions"
      );
    }
  };

  const getRecentSubmissions = async () => {
    try {
      const res = await axios.get(`${apiurl}/admin/recent-submissions`, { withCredentials: true });
      console.log(res)
      if (res.data.success) {
        setRecentSubmissions(res.data?.submissions);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while fetching recent submissions"
      );
    }
  };

  const handleDelete = async (titleId) => {
    try {
      const response = await axios.delete(`${apiurl}/admin/delete-title/${titleId}`, { withCredentials: true }); 
      console.log(response);
      toast.success(response.data.message || "Title deleted successfully");
      // Refresh recent submissions list
      getRecentSubmissions()
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while deleting the title"
      );
    }
  }

  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetchTodayRequests();
    getAdminStats()
    getRejectionInsights()
    getProbabilityBreakdown()
    getTopStatesBySubmissions()
    getRecentSubmissions()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-50 px-6 py-14">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-12 flex flex-col justyfy-center items-center">
          <span className="inline-block text-center mb-2 px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">
            Admin Panel • AI Registry
          </span>
          <h1 className="text-4xl text-center font-extrabold mb-2">
            Title Verification Dashboard
          </h1>
          <p className="text-slate-600 text-center max-w-3xl">
            Centralized monitoring and analytics dashboard for AI-powered
            title verification, similarity detection, and policy enforcement.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Titles" value={allTitlesCount} />
          <StatCard title="Today's Requests" value={todayRequests} accent="blue" />
          <StatCard title="Approved Titles" value={approvedTitles} accent="green" />
          <StatCard title="Rejected Titles" value={rejectedTitles} accent="red" />
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

          {/* Decision Insights */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h3 className="text-lg font-semibold mb-4">
              Decision Distribution
            </h3>
            <InsightRow label="Semantic Similarity" value={`${rejectionInsights?.semantic}%`} />
            <InsightRow label="Rule Violation" value={`${rejectionInsights?.rule}%`} />
            <InsightRow label="Phonetic Match" value={`${rejectionInsights?.phonetic}%`} />
            <InsightRow label="Other Reasons" value={`${rejectionInsights?.other}%`} />
          </div>

          {/* Probability Insights */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h3 className="text-lg font-semibold mb-4">
              Probability Breakdown
            </h3>
            <ProbabilityBar label="0–20%" value={probabilityBreakdown?.["0-20"] || 0} />
            <ProbabilityBar label="21–50%" value={probabilityBreakdown?.["21-50"] || 0} />
            <ProbabilityBar label="51–80%" value={probabilityBreakdown?.["51-80"] || 0} />
            <ProbabilityBar label="81–100%" value={probabilityBreakdown?.["81-100"] || 0} />
          </div>

          {/* State-wise Activity */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h3 className="text-lg font-semibold mb-4">
              Top States by Submissions
            </h3>
            <InsightRow label={topStates?.[0]?.state || "Delhi"} value={`${topStates?.[0]?.percentage || 0}%`} />
            <InsightRow label={topStates?.[1]?.state || "Uttar Pradesh"} value={`${topStates?.[1]?.percentage || 0}%`} />
            <InsightRow label={topStates?.[2]?.state || "Bihar"} value={`${topStates?.[2]?.percentage || 0}%`} />
            <InsightRow label={topStates?.[3]?.state || "Maharashtra"} value={`${topStates?.[3]?.percentage || 0}%`} />
          </div>
        </div>

        {/* Recent Submissions */}
        <h1 className="text-2xl text-center font-bold mb-6">
          Recent Title Submissions
        </h1>
        <div className="bg-white rounded-3xl shadow-xl">
        
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-3 rounded-tl-3xl text-left">ID</th>
                <th className="px-5 py-3 text-left">Title</th>
                <th className="px-5 py-3 text-left">State</th>
                <th className="px-5 py-3 text-left">Probability</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 rounded-tr-3xl text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {
                recentSubmissions?.map((item) => (
                  <tr key={item._id} className="border-t rounded-b-3xl  ">
                    <td className="px-5 py-3 font-semibold text-indigo-600">
                      {item.titleCode}
                    </td>
                    <td className="px-5 py-3">{item.titleName}</td>
                    <td className="px-5 py-3">{item.state}</td>
                    <td className="px-5 py-3 font-semibold">
                      {item.verificationProbability}%
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={item.verified} />
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="group cursor-pointer inline-flex items-center justify-center rounded-full p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete title"
                      >
                        <TrashIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ title, value, accent }) => (
  <div className="bg-white rounded-2xl shadow p-6">
    <p className="text-sm text-slate-500">{title}</p>
    <p
      className={`text-3xl font-extrabold mt-2 ${
        accent === "green"
          ? "text-emerald-600"
          : accent === "red"
          ? "text-rose-600"
          : accent === "blue"
          ? "text-indigo-600"
          : "text-slate-800"
      }`}
    >
      {value}
    </p>
  </div>
);

const InsightRow = ({ label, value }) => (
  <div className="flex justify-between text-sm mb-3">
    <span className="text-slate-600">{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);

const ProbabilityBar = ({ label, value }) => (
  <div className="mb-4">
    <div className="flex justify-between text-xs mb-1">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-2 rounded-full bg-slate-200">
      <div
        className="h-2 rounded-full bg-indigo-600"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const ok = status === true;
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        ok
          ? "bg-emerald-100 text-emerald-700"
          : "bg-rose-100 text-rose-700"
      }`}
    >
      {ok ? "ACCEPTED" : "REJECTED"}
    </span>
  );
};

export default AdminDashboard;
