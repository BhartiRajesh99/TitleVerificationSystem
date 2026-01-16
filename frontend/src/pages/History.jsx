import axios from "axios";
import { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { TrashIcon } from "@heroicons/react/24/outline";
import { apiUrl } from "../constants/apiURL";

const History = () => {

  const [searchCode, setSearchCode] = useState("");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const [allTitles, setAllTitles] = useState([]);
  const [titles, setTitles] = useState([]);

  
  const [pageLoading, setPageLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);

  const acceptedCount = allTitles.filter(t => t.verified).length;
  const rejectedCount = allTitles.length - acceptedCount;

  const states = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
    "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
    "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
    "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
    "Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu and Kashmir",
    "Ladakh","Chandigarh","Dadra and Nagar Haveli","Daman and Diu",
    "Lakshadweep","Puducherry","Andaman and Nicobar Islands"
  ];

  const getAllUserTitles = async () => {
    setPageLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/titles/all`, { withCredentials: true });
      setAllTitles(res.data.results);
      setTitles(res.data.results);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch title history");
    } finally {
      setPageLoading(false);
      setTableLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setTableLoading(true);

      await axios.delete(`${apiUrl}/titles/${id}`, { withCredentials: true });
      toast.success("Title deleted");

      setAllTitles(prev => prev.filter(t => t.id !== id));
      setTitles(prev => prev.filter(t => t.id !== id));

    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    } finally {
      setTableLoading(false);
    }
  };

  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    getAllUserTitles();
  }, []);

  const hasUserInteracted = useRef(false);

  useEffect(() => {
    if (!hasUserInteracted.current) return;

    setTableLoading(true);

    const delay = setTimeout(() => {
      let filtered = [...allTitles];

      if (searchCode) {
        filtered = filtered.filter(t =>
          t.titleCode.toLowerCase().includes(searchCode.toLowerCase())
        );
      }

      if (selectedState !== "All States") {
        filtered = filtered.filter(t => t.state === selectedState);
      }

      if (selectedStatus !== "All Status") {
        filtered = filtered.filter(t =>
          selectedStatus === "Accepted" ? t.verified : !t.verified
        );
      }

      setTitles(filtered);
      setTableLoading(false);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchCode, selectedState, selectedStatus, allTitles]);

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">
          <span className="inline-block mb-4 px-4 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-700">
            AI-Driven • Submission Log
          </span>

          <h1 className="text-4xl font-extrabold mb-2">Submission History</h1>
          <p className="text-slate-600 max-w-3xl mx-auto">
            Audit trail of submitted titles with AI decisions and confidence scores.
          </p>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {pageLoading ? (
            <>
              <KpiSkeleton />
              <KpiSkeleton />
              <KpiSkeleton />
            </>
          ) : (
            <>
              <KpiCard title="Total Submissions" value={allTitles.length} />
              <KpiCard title="Accepted Titles" value={acceptedCount} accent="green" />
              <KpiCard title="Rejected Titles" value={rejectedCount} accent="red" />
            </>
          )}
        </div>

        {/* FILTERS */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            placeholder="Search title by ID"
            className="flex-1 px-5 py-3 shadow rounded-xl bg-white focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => {
              hasUserInteracted.current = true;
              setSearchCode(e.target.value);
            }}
          />

          <select
            className="flex-[0.5] shadow px-5 py-3 rounded-xl bg-white"
            onChange={(e) => {
              hasUserInteracted.current = true;
              setSelectedState(e.target.value);
            }}
          >
            <option>All States</option>
            {states.map(s => <option key={s}>{s}</option>)}
          </select>

          <select
            className="flex-[0.5] shadow px-5 py-3 rounded-xl bg-white"
            onChange={(e) => {
              hasUserInteracted.current = true;
              setSelectedStatus(e.target.value);
            }}
          >
            <option>All Status</option>
            <option>Accepted</option>
            <option>Rejected</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-3xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                {["ID","Title","State","Periodicity","Acceptability","Status","Date","Action"]
                  .map(h => <th key={h} className="px-6 py-4 text-left">{h}</th>)}
              </tr>
            </thead>

            <tbody>
              {tableLoading ? (
                <TableSkeleton />
              ) : (
                titles.map(item => (
                  <tr key={item.id} className="border-t hover:bg-indigo-50/40">
                    <td className="px-6 py-4 font-semibold text-indigo-600">{item.titleCode || "--"}</td>
                    <td className="px-6 py-4">{item.titleName || "--"}</td>
                    <td className="px-6 py-4">{item.state || "--"}</td>
                    <td className="px-6 py-4">{item.periodity || "--"}</td>
                    <td className="px-6 py-4 font-semibold">{item.verificationProbability ? `${item.verificationProbability}%` : "--"}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.verified ? "ACCEPTED" : "REJECTED"} />
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {item.createdAt.split("T")[0] || "--"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-full cursor-pointer text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
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
    <p className={`text-3xl font-extrabold mt-2 ${
      accent === "green" ? "text-emerald-600" :
      accent === "red" ? "text-rose-600" : "text-indigo-600"
    }`}>
      {value}
    </p>
  </div>
);

const StatusBadge = ({ status }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
    status === "ACCEPTED"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-rose-100 text-rose-700"
  }`}>
    {status}
  </span>
);

const KpiSkeleton = () => (
  <div className="bg-white rounded-2xl shadow p-6 animate-pulse">
    <div className="h-4 w-28 bg-slate-200 rounded mb-3" />
    <div className="h-8 w-16 bg-slate-300 rounded" />
  </div>
);

const TableSkeleton = () => (
  <>
    {[1,2,3,4,5].map(i => (
      <tr key={i} className="border-t animate-pulse">
        {[1,2,3,4,5,6,7,8].map(j => (
          <td key={j} className="px-6 py-4">
            <div className="h-4 bg-slate-200 rounded" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

export default History;
