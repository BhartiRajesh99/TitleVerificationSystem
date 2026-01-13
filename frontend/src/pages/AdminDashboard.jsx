import { TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const apiurl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Data states
  const [allTitlesCount, setAllTitlesCount] = useState(0);
  const [todayRequests, setTodayRequests] = useState(0);
  const [approvedTitles, setApprovedTitles] = useState(0);
  const [rejectedTitles, setRejectedTitles] = useState(0);
  const [rejectionInsights, setRejectionInsights] = useState(null);
  const [probabilityBreakdown, setProbabilityBreakdown] = useState(null);
  const [topStates, setTopStates] = useState(null);
  const [recentSubmissions, setRecentSubmissions] = useState(null);

  // Loading states
  const [loadingRequests, setLoadingRequests] = useState(true)
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [loadingProbability, setLoadingProbability] = useState(true);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);

  // Api calls
  const fetchTodayRequests = async () => {
    try {
      const res = await axios.get(`${apiurl}/admin/today-requests`, { withCredentials: true });
      setTodayRequests(res.data.count);
    } catch(error) {
      console.log(error)
      toast.error("Failed to load today's requests");
    } finally {
      setLoadingRequests(false)
    }
  };

  const getAdminStats = async () => {
    try {
      const res = await axios.get(`${apiurl}/admin/stats`, { withCredentials: true });
      setApprovedTitles(res.data.approved);
      setRejectedTitles(res.data.rejected);
      setAllTitlesCount(res.data.total);
    } catch (error){
      console.log(error)
      toast.error("Failed to load statistics");
    } finally {
      setLoadingStats(false);
    }
  };

  const getRejectionInsights = async () => {
    try {
      const res = await axios.get(`${apiurl}/admin/rejection-insights`, { withCredentials: true });
      setRejectionInsights(res.data.insights);
    } catch(error) {
      console.log(error)
      toast.error("Failed to load rejection insights");
    } finally {
      setLoadingInsights(false);
    }
  };

  const getProbabilityBreakdown = async () => {
    try {
      const res = await axios.get(`${apiurl}/admin/probability-breakdown`, { withCredentials: true });
      setProbabilityBreakdown(res.data.breakdown);
    } catch(error) {
      console.log(error)
      toast.error("Failed to load probability breakdown");
    } finally {
      setLoadingProbability(false);
    }
  };

  const getTopStatesBySubmissions = async () => {
    try {
      const res = await axios.get(`${apiurl}/admin/top-states`, { withCredentials: true });
      setTopStates(res.data.states);
    } catch(error) {
      console.log(error)
      toast.error("Failed to load top states");
    } finally {
      setLoadingStates(false);
    }
  };

  const getRecentSubmissions = async () => {
    try {
      const res = await axios.get(`${apiurl}/admin/recent-submissions`, { withCredentials: true });
      setRecentSubmissions(res.data.submissions);
    } catch(error) {
      console.log(error)
      toast.error("Failed to load recent submissions");
    } finally {
      setLoadingRecent(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoadingRecent(true)
      await axios.delete(`${apiurl}/admin/delete-title/${id}`, { withCredentials: true });
      toast.success("Title deleted");
      getRecentSubmissions();

    } catch(error) {
      console.log(error)
      toast.error("Delete failed");
    } finally {
      setLoadingRecent(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    getAdminStats();
    fetchTodayRequests();
    getRejectionInsights();
    getProbabilityBreakdown();
    getTopStatesBySubmissions();
    getRecentSubmissions();
  }, [loadingRecent]);

  // UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">
          <span className="inline-block mb-2 px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">
            Admin Panel • AI Registry
          </span>
          <h1 className="text-4xl font-extrabold mb-2">Title Verification Dashboard</h1>
          <p className="text-slate-600 max-w-3xl mx-auto">
            Centralized monitoring and analytics for AI-powered title verification.
          </p>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {loadingStats && loadingRequests
            ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
            : (
              <>
                <StatCard title="Total Titles" value={allTitlesCount} />
                <StatCard title="Today's Requests" value={todayRequests} accent="blue" />
                <StatCard title="Approved Titles" value={approvedTitles} accent="green" />
                <StatCard title="Rejected Titles" value={rejectedTitles} accent="red" />
              </>
            )}
        </div>

        {/* ANALYTICS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <AnalyticsCard title="Decision Distribution">
            {loadingInsights ? <InsightSkeleton /> : (
              <>
                <InsightRow label="Semantic Similarity" value={`${rejectionInsights.semantic}%`} />
                <InsightRow label="Rule Violation" value={`${rejectionInsights.rule}%`} />
                <InsightRow label="Phonetic Match" value={`${rejectionInsights.phonetic}%`} />
                <InsightRow label="Other Reasons" value={`${rejectionInsights.other}%`} />
              </>
            )}
          </AnalyticsCard>

          <AnalyticsCard title="Probability Breakdown">
            {loadingProbability ? <BarSkeleton /> : (
              Object.entries(probabilityBreakdown).map(([k, v]) => (
                <ProbabilityBar key={k} label={k} value={v} />
              ))
            )}
          </AnalyticsCard>

          <AnalyticsCard title="Top States by Submissions">
            {loadingStates ? <InsightSkeleton /> : (
              topStates.map((s, i) => (
                <InsightRow key={i} label={s.state} value={`${s.percentage}%`} />
              ))
            )}
          </AnalyticsCard>
        </div>

        {/* TABLE */}
        <h2 className="text-2xl font-bold text-center mb-6">Recent Title Submissions</h2>
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                {["ID", "Title", "State", "Probability", "Status", "Action"].map(h => (
                  <th key={h} className="px-5 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingRecent ? <TableSkeleton /> : recentSubmissions.map(item => (
                <tr key={item._id} className="border-t">
                  <td className="px-5 py-3 font-semibold text-indigo-600">{item.titleCode}</td>
                  <td className="px-5 py-3">{item.titleName}</td>
                  <td className="px-5 py-3">{item.state}</td>
                  <td className="px-5 py-3 font-semibold">{item.verificationProbability}%</td>
                  <td className="px-5 py-3"><StatusBadge status={item.verified} /></td>
                  <td className="px-5 py-3">
                    <button onClick={() => handleDelete(item._id)} className="text-rose-600 cursor-pointer hover:bg-rose-50 p-2 rounded-full">
                      <TrashIcon className="h-5 w-5" />
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

// UI Components

const AnalyticsCard = ({ title, children }) => (
  <div className="bg-white rounded-3xl shadow-xl p-8">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

const StatCard = ({ title, value, accent }) => (
  <div className="bg-white rounded-2xl shadow p-6">
    <p className="text-sm text-slate-500">{title}</p>
    <p className={`text-3xl font-extrabold mt-2 ${
      accent === "green" ? "text-emerald-600" :
      accent === "red" ? "text-rose-600" :
      accent === "blue" ? "text-indigo-600" : "text-slate-800"
    }`}>
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
      <span>{label}%</span>
      <span>{value}%</span>
    </div>
    <div className="h-2 rounded-full bg-slate-200">
      <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${value}%` }} />
    </div>
  </div>
);

// SKELETONS

const StatSkeleton = () => (
  <div className="bg-white rounded-2xl shadow p-6 animate-pulse">
    <div className="h-4 w-24 bg-slate-200 rounded mb-3" />
    <div className="h-8 w-16 bg-slate-300 rounded" />
  </div>
);

const InsightSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {[1,2,3,4].map(i => (
      <div key={i} className="flex justify-between">
        <div className="h-4 w-32 bg-slate-200 rounded" />
        <div className="h-4 w-12 bg-slate-300 rounded" />
      </div>
    ))}
  </div>
);

const BarSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[1,2,3,4].map(i => (
      <div key={i}>
        <div className="flex justify-between mb-1">
          <div className="h-3 w-16 bg-slate-200 rounded" />
          <div className="h-3 w-8 bg-slate-300 rounded" />
        </div>
        <div className="h-2 bg-slate-200 rounded" />
      </div>
    ))}
  </div>
);

const TableSkeleton = () => (
  <>
    {[1,2,3,4,5].map(i => (
      <tr key={i} className="border-t animate-pulse">
        {[1,2,3,4,5,6].map(j => (
          <td key={j} className="px-5 py-4">
            <div className="h-4 bg-slate-200 rounded" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

const StatusBadge = ({ status }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
    status ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
  }`}>
    {status ? "ACCEPTED" : "REJECTED"}
  </span>
);

export default AdminDashboard;
