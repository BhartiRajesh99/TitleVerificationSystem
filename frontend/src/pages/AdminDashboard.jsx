import { TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const apiurl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // states
  const [stats, setStats] = useState(null);
  const [todayRequests, setTodayRequests] = useState(null);
  const [rejectionInsights, setRejectionInsights] = useState(null);
  const [probabilityBreakdown, setProbabilityBreakdown] = useState(null);
  const [topStates, setTopStates] = useState(null);
  const [recentSubmissions, setRecentSubmissions] = useState(null);

  // loading states
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);

  // data fetch
  const loadDashboard = async () => {
    setDashboardLoading(true);

    const results = await Promise.allSettled([
      axios.get(`${apiurl}/admin/stats`, { withCredentials: true }),
      axios.get(`${apiurl}/admin/today-requests`, { withCredentials: true }),
      axios.get(`${apiurl}/admin/rejection-insights`, { withCredentials: true }),
      axios.get(`${apiurl}/admin/probability-breakdown`, { withCredentials: true }),
      axios.get(`${apiurl}/admin/top-states`, { withCredentials: true }),
      axios.get(`${apiurl}/admin/recent-submissions`, { withCredentials: true })
    ]);

    const [
      statsRes,
      todayRes,
      rejectionRes,
      probabilityRes,
      statesRes,
      recentRes
    ] = results;

    console.log(recentRes.value.data.submissions)
    if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
    if (todayRes.status === "fulfilled") setTodayRequests(todayRes.value.data.count);
    if (rejectionRes.status === "fulfilled") setRejectionInsights(rejectionRes.value.data.insights);
    if (probabilityRes.status === "fulfilled") setProbabilityBreakdown(probabilityRes.value.data.breakdown);
    if (statesRes.status === "fulfilled") setTopStates(statesRes.value.data.states);
    if (recentRes.status === "fulfilled") setRecentSubmissions(recentRes.value.data.submissions);

    results.forEach((r, i) => {
      if (r.status === "rejected") {
        console.error(r.reason);
        toast.error(`Some dashboard data failed to load`);
      }
    });

    setDashboardLoading(false);
    setRecentLoading(false);
  };

  // delete
  const handleDelete = async (id) => {
    try {
      setRecentLoading(true);

      // find deleted item before deleting
      const deletedItem = recentSubmissions.find(item => item._id === id);

      const response = await axios.delete(`${apiurl}/admin/delete-title/${id}`, {
        withCredentials: true
      });

      console.log(response)
      toast.success("Title deleted");

      // update table
      setRecentSubmissions(prev =>
        prev.filter(item => item._id !== id)
      );

      // update states
      setStats(prev => {
        if (!prev || !deletedItem) return prev;

        return {
          ...prev,
          total: prev.total - 1,
          approved: deletedItem.verified ? prev.approved - 1 : prev.approved,
          rejected: !deletedItem.verified ? prev.rejected - 1 : prev.rejected
        };
      });

    } catch (error) {
      console.log(error)
      toast.error("Delete failed");
    } finally {
      setRecentLoading(false);
    }
  };


  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-10">
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
          {dashboardLoading
            ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
            : (
              <>
                <StatCard title="Total Titles" value={stats?.total ?? "—"} />
                <StatCard title="Today's Requests" value={todayRequests ?? "—"} accent="blue" />
                <StatCard title="Approved Titles" value={stats?.approved ?? "—"} accent="green" />
                <StatCard title="Rejected Titles" value={stats?.rejected ?? "—"} accent="red" />
              </>
            )}
        </div>

        {/* ANALYTICS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <AnalyticsCard title="Decision Distribution">
            {!rejectionInsights ? <InsightSkeleton /> : (
              <>
                <InsightRow label="Semantic Similarity" value={`${rejectionInsights.semantic}%`} />
                <InsightRow label="Rule Violation" value={`${rejectionInsights.rule}%`} />
                <InsightRow label="Phonetic Match" value={`${rejectionInsights.phonetic}%`} />
                <InsightRow label="Other Reasons" value={`${rejectionInsights.other}%`} />
              </>
            )}
          </AnalyticsCard>

          <AnalyticsCard title="Probability Breakdown">
            {!probabilityBreakdown ? <BarSkeleton /> : (
              Object.entries(probabilityBreakdown).map(([k, v]) => (
                <ProbabilityBar key={k} label={k} value={v} />
              ))
            )}
          </AnalyticsCard>

          <AnalyticsCard title="Top States by Submissions">
            {!topStates ? <InsightSkeleton /> : (
              topStates.map((s, i) => (
                <InsightRow key={i} label={s.state} value={`${s.percentage}%`} />
              ))
            )}
          </AnalyticsCard>
        </div>

        {/* TABLE */}
        <h2 className="text-2xl font-bold text-center mb-6">Recent Title Submissions</h2>
        <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-3xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                {["ID", "Title", "State", "Periodicity", "Acceptability", "Status", "Date", "Action"].map(h => (
                  <th key={h} className="px-6 py-4 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentLoading ? <TableSkeleton /> : recentSubmissions?.map(item => (
                <tr key={item._id} className="border-t hover:bg-indigo-50/40">
                  <td className="px-5 py-3 font-semibold text-indigo-600">{item.titleCode}</td>
                  <td className="px-5 py-3">{item.titleName}</td>
                  <td className="px-5 py-3">{item.state}</td>
                  <td className="px-6 py-4">{item.periodity}</td>
                  <td className="px-5 py-3 font-semibold">{item.verificationProbability}%</td>
                  <td className="px-5 py-3"><StatusBadge status={item.verified} /></td>
                  <td className="px-6 py-4 text-slate-500">
                    {item.createdAt.split("T")[0]}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-rose-600 cursor-pointer hover:bg-rose-50 p-2 rounded-full"
                    >
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
