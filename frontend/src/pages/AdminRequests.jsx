import { useNavigate } from "react-router";
import {
  InboxIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import axios from "axios"
import { toast } from "react-hot-toast"
import { useEffect } from "react";
import AdminRequestsSkeleton from "../components/AdminRequestSkeleton";
import { useRequests } from "../context/RequestsContext";
import { apiUrl } from "../constants/apiURL";

const statusStyles = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const AdminRequests = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [requests, setRequests] = React.useState([])
  const { setPendingCount } = useRequests();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/admin/requests`, {withCredentials: true})
      console.log(res.data.requests)
      setRequests(res.data.requests)
    } catch (error) {
      console.log("Error fetching requests:", error)
      toast.error( error?.response?.data?.message || "Failed to fetch requests")
    } finally {
      setLoading(false);
    }
  }

  const updateStatus = async (id, status) => {
    try {
      setLoading(true)
      const response = await axios.patch(`${apiUrl}/admin/requests/${id}`, {status}, {withCredentials: true})
      console.log(response.data)
      const pendingRequests = await axios.get(`${apiUrl}/admin/requests/pending/count`, {withCredentials: true})
      setPendingCount(pendingRequests.data?.count)
      toast.success(`Request ${status}`)
      fetchRequests();
    } catch (error) {
      console.log("Error approving request:", error)
      toast.error( error?.response?.data?.message || "Failed to approve request")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests();
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-8">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Access Requests
        </h1>
        <p className="mt-1 mb-8 text-sm text-slate-600">
          Requests submitted via Contact Admin form
        </p>
        <AdminRequestsSkeleton />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Access Requests
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Requests submitted via Contact Admin form
          </p>
        </div>

        <button
          onClick={() => navigate("/admin")}
          className="rounded-xl cursor-pointer border border-slate-300
                     px-4 py-2 text-sm font-semibold
                     text-slate-700 hover:bg-slate-100">
          Back to Dashboard
        </button>
      </div>

      {/* Empty State */}
      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center
                        rounded-2xl border border-dashed border-slate-300
                        bg-white p-12 text-center">
          <InboxIcon className="h-12 w-12 text-slate-400 mb-3" />
          <p className="text-slate-600 font-medium">
            No requests received yet
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full border-collapse">
            <thead className="bg-slate-100 text-left text-sm text-slate-600">
              <tr>
                <th className="px-4 py-3">Request ID</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 text-sm">
              {requests.map((req) => (
                <tr key={req._id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-600 font-mono text-sm">
                    {req._id.substring(0,8)}
                  </td >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-800">
                      {req.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {req.email}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-slate-700">
                    {req.organization}
                  </td>

                  <td className="px-4 py-3 max-w-xs truncate text-slate-600">
                    {req.message}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full
                                  px-3 py-1 text-xs font-semibold
                                  ${statusStyles[req.status]}`}
                    >
                      {req.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-slate-500">
                    {req.createdAt.split("T")[0]}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {req.status === "pending" ? (
                        <>
                          <button
                            title="Approve"
                            onClick={() => {
                              updateStatus(req._id, "approved")
                            }}
                            className="rounded-lg cursor-pointer border border-green-200 p-2 text-green-600 hover:bg-green-50">
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>

                          <button
                            title="Reject"
                            onClick={() => {
                              updateStatus(req._id, "rejected")
                            }}
                            className="rounded-lg cursor-pointer border border-red-200 p-2 text-red-600 hover:bg-red-50">
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        </>
                      ) : (
                        <button
                          title={req.status === "approved" ? "Approved" : "Rejected"}
                          className={`rounded-lg border ${req.status === "approved" ? "border-green-200 p-2 text-green-600 hover:bg-green-50" : "border-red-200 p-2 text-red-600 hover:bg-red-50" }`}>
                            {req.status === "approved" ? (
                              <CheckCircleIcon className="h-5 w-5" />
                            ) : (
                              <XCircleIcon className="h-5 w-5" />
                            )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminRequests;
